import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Management Agent",
  description: "AI-powered HR assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-blue-700 text-white px-6 py-3 flex gap-6 items-center shadow">
          <span className="font-bold text-lg">HR Agent</span>
          <a href="/" className="hover:underline text-sm">Dashboard</a>
          <a href="/chat" className="hover:underline text-sm">Chat</a>
          <a href="/leaves" className="hover:underline text-sm">Leaves</a>
          <a href="/salary" className="hover:underline text-sm">Salary</a>
          <a href="/policies" className="hover:underline text-sm">Policies</a>
          <span className="ml-auto text-xs opacity-75">Logged in as: Alice Johnson (E001)</span>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
