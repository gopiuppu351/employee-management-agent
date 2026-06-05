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
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6 items-center">
          <span className="font-semibold text-gray-900 text-base tracking-tight">HR Agent</span>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dashboard</a>
          <a href="/chat" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Chat</a>
          <a href="/leaves" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Leaves</a>
          <a href="/salary" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Salary</a>
          <a href="/policies" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Policies</a>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Alice Johnson · E001</span>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
