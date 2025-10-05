import { NextResponse } from "next/server";
import { validateRequest } from "@/app/lib/validateRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createAddressRecord } from "@/app/services/addressService";
import { createStoreByZoneId } from "@/app/services/locationService";
import { storeSchema } from "./storeSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "user id missing" }, { status: 404 });
    }

    const validation = await validateRequest(body, storeSchema);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error }, { status: 400 });
    }

    const storeObj = {
      name: body.storeName,
      mapLink: body.link,
      zoneId: body.zoneId,
      latitude: body.latitude,
      longitude: body.longitude,
    };

    const store = await createStoreByZoneId(storeObj);

    if (!store.id) {
      return NextResponse.json(
        { message: "error while creating store record" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "store added succesfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Internal server error", error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
