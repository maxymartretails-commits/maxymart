// src/lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { CustomPrismaAdapter } from "./customAdapter";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | null;
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        fullName: { label: "Full Name", type: "text" },
        password: { label: "Password", type: "password" },
        phoneNumber: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const mode = credentials?.mode;
        console.log("mode", mode);

        // ----------------- 2. signIn LOGIN -------------------
        if (mode === "signIn") {
          if (!credentials?.phoneNumber) {
            throw new Error("phoneNumber is required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.phoneNumber },
          });

          if (!user) {
            throw new Error("USER_DOES_NOT_EXIST");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          };
        }

        // ----------------- 3. SIGNUP -------------------
        if (mode === "signUp") {
          const phone = credentials?.phoneNumber;
          const fullName = credentials?.fullName;
          const otp = credentials?.otp;

          if (!phone || !otp) {
            throw new Error("PHONE_AND_OTP_REQUIRED");
          }

          const otpRecord = await prisma.otpCode.findFirst({
            where: {
              phoneNumber: `+91${phone}`,
              expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });

          console.log(otpRecord, "otpRecord");

          if (!otpRecord) {
            throw new Error("INVALID_OR_EXPIRED_OTP");
          }

          // Optional: delete used OTP
          await prisma.otpCode.delete({ where: { id: otpRecord.id } });

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phoneNumber: phone },
          });

          const userRole = await prisma.role.findUnique({
            where: { name: "user" },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phoneNumber: phone,
                name: fullName || "",
                email: null,
                password: null,
                profileImage: "",
                roles: { connect: { id: userRole?.id } },
              },
            });
          }

          // 🔁 GET fresh user with role
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              roles: { select: { name: true } },
            },
          });
          console.log("dbUser", dbUser);

          if (!dbUser) {
            throw new Error("USER_NOT_FOUND");
          }

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            profileImage: dbUser.profileImage,
            role: dbUser.roles?.name,
          };
        }

        throw new Error("INVALID_MODE");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          profileImage: profile.picture,
        };
      },
    }),
  ],
  pages: {
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: import("next-auth/jwt").JWT;
      user?: import("next-auth").User;
    }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }, // Use ID directly
          select: {
            id: true,
            roles: { select: { name: true } },
            profileImage: true,
            email: true,
            name: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.roles?.name || null;
          token.profileImage = dbUser.profileImage || null;
          token.email = dbUser.email || null;
          token.name = dbUser.name || null;
        }
      }

      return token;
    },

    async signIn({
      user,
      account,
    }: {
      user: import("next-auth").User;
      account: import("next-auth").Account | null;
    }) {
      // if (account?.provider === "credentials") {
      //   let existingUser = await prisma.user.findUnique({
      //     where: { email: user.email ?? undefined },
      //   });

      //   if (!existingUser?.emailVerified) {
      //     throw new Error("EMAIL_NOT_VERIFIED");
      //   }
      // }
      return true;
    },
    async session({
      session,
      token,
    }: {
      session: import("next-auth").Session;
      token: import("next-auth/jwt").JWT;
    }) {
      if (token && session.user) {
        session.user.id = token?.id || null;
        session.user.role = token?.role as string;
        session.user.image = token?.profileImage as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
