import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import ErrorBoundary from "@/components/ErrorBoundary";

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
          <nav
            className="px-6 py-4 flex gap-8 items-center shadow-md"
            style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}
          >
            <span
              className="font-bold text-base tracking-tight"
              style={{ color: "#22d3ee" }}
            >
              ⚡ HR Portal
            </span>
            <div className="flex gap-6">
              <a
                href="/"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/chat"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Chat
              </a>
              <a
                href="/leaves"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Leaves
              </a>
              <a
                href="/salary"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Salary
              </a>
              <a
                href="/policies"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Policies
              </a>
            </div>
            <span className="ml-auto flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <span
                className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold"
                style={{ fontSize: "10px" }}
              >
                GU
              </span>
              Goopi Uppu · E001
            </span>
          </nav>
          <main className="p-6">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
