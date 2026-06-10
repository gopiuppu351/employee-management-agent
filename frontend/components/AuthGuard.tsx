"use client";
import { useAuth } from "@/context/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated (except when already on login page)
  if (!user && pathname !== "/login") {
    return null; // Redirect will handle this
  }

  // Show children if authenticated or on login page
  return <>{children}</>;
}