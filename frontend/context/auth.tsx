"use client";
import { createContext, useContext, ReactNode } from "react";

interface AuthUser {
  employeeId: string;
  name: string;
}

const AuthContext = createContext<AuthUser>({
  employeeId: "E001",
  name: "Alice Johnson",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // In a real app, this would come from a login session / JWT token
  const user: AuthUser = {
    employeeId: "E001",
    name: "Alice Johnson",
  };

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthUser {
  return useContext(AuthContext);
}
