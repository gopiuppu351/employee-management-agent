"use client";
import { useState } from "react";

const API = "http://localhost:8000/api/salaries";

interface SalaryRecord {
  employee_id: string;
  base_salary: number;
  currency: string;
  last_updated: string;
}

export default function SalaryPage() {
  const [salary, setSalary] = useState<SalaryRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const employeeId = "E001";
  const requesterId = "E001";

  async function fetchSalary() {
    setLoading(true);
    setError("");
    setSalary(null);
    try {
      const res = await fetch(`${API}/${employeeId}?requester_id=${requesterId}`);
      const data = await res.json();
      if (res.ok) {
        setSalary(data.salary);
      } else {
        setError(data.detail ?? "Failed to fetch salary.");
      }
    } catch {
      setError("Could not reach the backend.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Salary Information</h1>

      <div className="rounded-2xl p-6" style={{ background: "var(--surface-card)", border: "1px solid #334155" }}>
        <p className="text-sm text-slate-400 mb-5">
          View your current compensation details. Access is restricted — only you or your manager can see this information.
        </p>
        <button onClick={fetchSalary} disabled={loading} className="px-6 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition mb-6" style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}>
          {loading ? "Loading..." : "View My Salary"}
        </button>

        {error && <p className="text-rose-400 text-sm rounded-lg px-3 py-2" style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.3)" }}>{error}</p>}

        {salary && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #1c1408, #271a08)", border: "1px solid #92400e" }}>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid #44300a" }}>
              <span className="text-sm font-medium text-amber-400">Employee ID</span>
              <span className="text-sm font-bold text-white px-2 py-0.5 rounded-md" style={{ background: "#0f172a", border: "1px solid #44300a" }}>{salary.employee_id}</span>
            </div>
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid #44300a" }}>
              <span className="text-sm font-medium text-amber-400">Base Salary</span>
              <span className="text-2xl font-bold text-amber-300">
                {salary.currency} {salary.base_salary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-amber-400">Last Updated</span>
              <span className="text-sm text-slate-400">{salary.last_updated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
