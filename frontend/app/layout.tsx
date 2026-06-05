import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Management Agent",
  description: "AI-powered HR assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--surface-bg)" }}>
        <nav className="px-6 py-3 flex gap-6 items-center" style={{ background: "#1c1917" }}>
          <span className="font-bold text-base text-white tracking-tight">⚡ HR Agent</span>
          <a href="/" className="text-sm text-stone-400 hover:text-white transition-colors">Dashboard</a>
          <a href="/chat" className="text-sm text-stone-400 hover:text-white transition-colors">Chat</a>
          <a href="/leaves" className="text-sm text-stone-400 hover:text-white transition-colors">Leaves</a>
          <a href="/salary" className="text-sm text-stone-400 hover:text-white transition-colors">Salary</a>
          <a href="/policies" className="text-sm text-stone-400 hover:text-white transition-colors">Policies</a>
          <span className="ml-auto text-xs text-stone-500 bg-stone-800 px-3 py-1 rounded-full">Alice Johnson · E001</span>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
