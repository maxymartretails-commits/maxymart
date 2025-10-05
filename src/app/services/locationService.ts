import { Prisma, PrismaClient } from "@prisma/client";
import { getDistance } from "geolib";
import { prisma } from "@/lib/prisma"; // adjust path

export const isUserWithinRadius = async (
  userLatitude: string | number,
  userLongitude: string | number,
  tx: PrismaClient = prisma
) => {
  try {
    const lat = Number(userLatitude);
    const lon = Number(userLongitude);

    const zones = await tx.deliveryZone.findMany({
      where: { deleted: false },
    });

    let closestZone: {
      zoneId: string;
      zoneName: string;
      distance: number;
      radiusMeters: number;
    } | null = null;

    for (const zone of zones) {
      const distance = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: zone.latitude, longitude: zone.longitude }
      );

      const radiusMeters = zone.radiusKm * 1000;

      if (distance <= radiusMeters) {
        if (!closestZone || distance < closestZone.distance) {
          closestZone = {
            zoneId: zone.id,
            zoneName: zone.name,
            distance,
            radiusMeters,
          };
        }
      }
    }

    if (closestZone) {
      return { isWithinRadius: true, ...closestZone };
    }

    // no zone found
    return {
      isWithinRadius: false,
      distance: null,
      radiusMeters: null,
      zoneId: null,
      zoneName: null,
    };
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

// export const isUserWithinRadius = async (
//   userLatitude: string | number,
//   userLongitude: string | number,
//   tx: PrismaClient = prisma
// ) => {
//   try {
//     const zones = await tx.deliveryZone.findMany({
//       where: { deleted: false },
//     });

//     for (const zone of zones) {
//       const distance = getDistance(
//         { latitude: userLatitude, longitude: userLongitude },
//         { latitude: zone.latitude, longitude: zone.longitude }
//       );

//       const radiusMeters = zone.radiusKm * 1000;

//       if (distance <= radiusMeters) {
//         return {
//           isWithinRadius: true,
//           distance,
//           radiusMeters,
//           zoneName: zone.name,
//         };
//       }
//     }

//     // No matching zone found
//     return {
//       isWithinRadius: false,
//       distance: null,
//       radiusMeters: null,
//       zoneId: null,
//       zoneName: null,
//     };
//   } catch (error: any) {
//     console.error("Internal server error", error);
//     throw error;
//   }
// };

export const createDeliveryZone = async (
  deliveryZoneObj: Prisma.DeliveryZoneCreateInput,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const newDeliveryZone = await prisma.deliveryZone.create({
      data: deliveryZoneObj,
    });

    return newDeliveryZone;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getDeliveryZoneById = async (
  zoneId: string,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const zone = await tx.deliveryZone.findUnique({ where: { id: zoneId } });
    return zone;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const createStoreByZoneId = async (
  storeObj: Prisma.StoreUncheckedCreateInput,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const check = await isUserWithinRadius(
      storeObj.latitude,
      storeObj.longitude
    );

    if (!check.isWithinRadius) {
      throw new Error("store is outside all delivery zones");
    }
    console.log(`store will be linked to zone: ${check.zoneName}`);

    const newStoreInDeliveryZone = await prisma.store.create({
      data: {
        name: storeObj.name,
        latitude: storeObj.latitude,
        longitude: storeObj.longitude,
        mapLink: storeObj.mapLink,
        zone: { connect: { id: check.zoneId! } },
      },
    });

    return newStoreInDeliveryZone;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const findNearestStoreInZone = async (
  latitude: number,
  longitude: number,
  zoneId: string,
  tx: Prisma.TransactionClient
) => {
  const stores = await tx.store.findMany({
    where: { zoneId, deleted: false },
  });

  if (!stores.length) {
    throw new Error("No stores found in this zone");
  }

  let nearest = stores[0];
  let nearestDistance = getDistance(
    { latitude, longitude },
    { latitude: nearest.latitude, longitude: nearest.longitude }
  );

  for (const store of stores) {
    const distance = getDistance(
      { latitude, longitude },
      { latitude: store.latitude, longitude: store.longitude }
    );

    if (distance < nearestDistance) {
      nearest = store;
      nearestDistance = distance;
    }
  }

  return { store: nearest, distance: nearestDistance };
};
