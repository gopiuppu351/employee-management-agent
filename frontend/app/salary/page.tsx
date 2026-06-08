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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Salary Information</h1>

      <div className="card-accent-fuchsia bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-sm text-slate-400 mb-5">
          View your current compensation details.
        </p>
        <button onClick={fetchSalary} disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition mb-6" style={{ background: "#e879f9" }}>
          {loading ? "Loading..." : "View My Salary"}
        </button>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
        )}

        {salary && (
          <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-fuchsia-100">
              <span className="text-sm text-slate-500">Employee ID</span>
              <span className="text-sm font-bold text-slate-700">{salary.employee_id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-fuchsia-100">
              <span className="text-sm text-slate-500">Base Salary</span>
              <span className="text-2xl font-bold text-fuchsia-600">
                {salary.currency} {salary.base_salary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Last Updated</span>
              <span className="text-sm text-slate-400">{salary.last_updated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
