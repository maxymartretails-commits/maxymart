import { prisma } from "@/lib/prisma";

export const getRoleByName = async (role: string) => {
  try {
    const userData = await prisma.role.findUnique({
      where: { name: role },
      include: { users: true },
    });

    if (!userData) {
      return { success: false, message: "userRole not found" };
    }

    return {
      success: true,
      userData,
    };
  } catch (error: any) {
    console.error("Internal server error", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { Address: true },
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
