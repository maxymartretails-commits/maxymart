// context/auth-context.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

export interface AuthContextProps {
  user: any;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoggedIn: false,
  loading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const value: AuthContextProps = {
    user: session?.user || null,
    isLoggedIn: !!session,
    loading: status === "loading",
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
