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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.user) {
        const userData: AuthUser = {
          employeeId: data.user.employee_id,
          name: data.user.name,
          role: data.user.role,
          isAuthenticated: true,
        };
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
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
