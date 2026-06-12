"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface AuthUser {
  employeeId: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string): Promise<boolean> => {
    // Demo credentials — bypasses backend until /api/auth/login is implemented
    const DEMO_USERS: Record<string, { name: string; role: string; password: string }> = {
      "E001": { name: "Alice Johnson",  role: "employee", password: "password123" },
      "E002": { name: "Bob Smith",      role: "employee", password: "password123" },
      "E003": { name: "Carol Williams", role: "manager",  password: "password123" },
      "M001": { name: "David Manager",  role: "manager",  password: "password123" },
    };

    const match = DEMO_USERS[employeeId.toUpperCase()];
    if (match && match.password === password) {
      const userData: AuthUser = {
        employeeId: employeeId.toUpperCase(),
        name:  match.name,
        role:  match.role,
        isAuthenticated: true,
      };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
