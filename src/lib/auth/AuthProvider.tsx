"use client";
import { SessionProvider } from "next-auth/react";
import { AuthContextProvider } from "../context/authContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}
