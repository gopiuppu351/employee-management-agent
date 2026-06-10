import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HR Management Portal",
  description: "AI-powered HR assistant for employees and managers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{ background: "var(--surface-bg)" }}
      >
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            <main className="p-6">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
