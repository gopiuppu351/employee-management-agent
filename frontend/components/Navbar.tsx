"use client";
import { useAuth } from "@/context/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === "/login" || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
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
      
      <div className="ml-auto flex items-center gap-3">
        <span className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          <span
            className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold"
            style={{ fontSize: "10px" }}
          >
            {getInitials(user.name)}
          </span>
          {user.name} · {user.employeeId}
        </span>
        
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}