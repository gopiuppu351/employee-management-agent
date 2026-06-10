"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ employeeId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const success = await login(form.employeeId, form.password);
    
    if (success) {
      router.push("/");
    } else {
      setError("Invalid employee ID or password.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Employee Login</h1>
            <p className="text-slate-500 text-sm">Sign in to access the HR management system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                required
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value.trim() })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your employee ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              For demo purposes, use any employee ID with password "admin123"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}