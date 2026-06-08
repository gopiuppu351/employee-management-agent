import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Employee Management Agent",
  description: "AI-powered HR assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--surface-bg)" }}>
        <AuthProvider>
          <nav className="px-6 py-3 flex gap-6 items-center shadow-sm" style={{ background: "#0f172a" }}>
            <span className="font-bold text-base tracking-tight" style={{ color: "#22d3ee" }}>⚡ HR Agent</span>
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</a>
            <a href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">Chat</a>
            <a href="/leaves" className="text-sm text-slate-400 hover:text-white transition-colors">Leaves</a>
            <a href="/salary" className="text-sm text-slate-400 hover:text-white transition-colors">Salary</a>
            <a href="/policies" className="text-sm text-slate-400 hover:text-white transition-colors">Policies</a>
            <span className="ml-auto text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Alice Johnson · E001</span>
          </nav>
          <main className="p-6">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
