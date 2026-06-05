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
        <nav className="text-white px-6 py-4 flex gap-6 items-center" style={{ background: "var(--surface-nav)", borderBottom: "1px solid #1e293b" }}>
          <span className="font-bold text-lg tracking-tight text-white">HR Agent</span>
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</a>
          <a href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">Chat</a>
          <a href="/leaves" className="text-sm text-slate-400 hover:text-white transition-colors">Leaves</a>
          <a href="/salary" className="text-sm text-slate-400 hover:text-white transition-colors">Salary</a>
          <a href="/policies" className="text-sm text-slate-400 hover:text-white transition-colors">Policies</a>
          <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Alice Johnson · E001</span>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
