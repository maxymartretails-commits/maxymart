import { prisma } from "@/lib/prisma";
import { Address, Prisma } from "@prisma/client";

export const createAddressRecord = async (
  addressObj: Prisma.AddressUncheckedCreateInput,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    let address;
    const [existingAdress]: Address[] = await tx.address.findMany({
      where: { userId: addressObj.userId },
    });

    if (!existingAdress) {
      address = await prisma.address.create({ data: addressObj });
      return address;
    }

    address = await prisma.address.update({
      where: { id: existingAdress.id },
      data: addressObj,
    });

    return address;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
export const updateAddressRecord = async (
  addressId: string,
  addressObj: Prisma.AddressUncheckedUpdateInput,
  tx: Prisma.TransactionClient = prisma
) => {
  try {
    const existingAdress = await tx.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAdress) {
      throw new Error(`address not found for this Id ${addressId}`);
    }

    const newAddress = await prisma.address.update({
      where: { id: addressId },
      data: addressObj,
    });

    return newAddress;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
export const getAddressByUserId = async (userId: string) => {
  try {
    const existingUser = await prisma.address.findFirst({
      where: { userId: userId },
    });

    if (!existingUser) {
      throw new Error("user not found");
    }

    return existingUser;
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};
