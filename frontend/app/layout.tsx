import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Management Agent",
  description: "AI-powered HR assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--surface)" }}>
        <nav className="text-white px-6 py-3 flex gap-6 items-center shadow-lg" style={{ background: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)" }}>
          <span className="font-bold text-lg tracking-tight">⚡ HR Agent</span>
          <a href="/" className="text-sm text-indigo-200 hover:text-white transition-colors">Dashboard</a>
          <a href="/chat" className="text-sm text-indigo-200 hover:text-white transition-colors">Chat</a>
          <a href="/leaves" className="text-sm text-indigo-200 hover:text-white transition-colors">Leaves</a>
          <a href="/salary" className="text-sm text-indigo-200 hover:text-white transition-colors">Salary</a>
          <a href="/policies" className="text-sm text-indigo-200 hover:text-white transition-colors">Policies</a>
          <span className="ml-auto text-xs bg-indigo-800 bg-opacity-50 px-3 py-1 rounded-full">Alice Johnson · E001</span>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
