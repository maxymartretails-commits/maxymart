// lib/customAdapter.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
interface AdapterUser {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  profileImage?: string | null;
}

export function CustomPrismaAdapter(prisma: PrismaClient) {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    async createUser(data: Omit<AdapterUser, "id">) {
      const user = await prisma.user.create({
        data: {
          email: data.email as string,
          emailVerified: data.emailVerified
            ? data.emailVerified.toISOString()
            : null,
          name: data.name || "",
          profileImage: data.profileImage || "",
          roles: {
            connect: {
              name: "user",
            },
          },
        },
      });

      return user;
    },
  };
}
