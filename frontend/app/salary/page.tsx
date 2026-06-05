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
      <h1 className="text-2xl font-bold text-indigo-900 mb-6">Salary Information</h1>

      <div className="card-accent-amber bg-white rounded-xl shadow-sm border border-amber-100 p-6">
        <p className="text-sm text-slate-500 mb-5">
          View your current compensation details. Access is restricted — only you or your manager can see this information.
        </p>
        <button onClick={fetchSalary} disabled={loading} className="bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 transition mb-6 shadow-sm">
          {loading ? "Loading..." : "View My Salary"}
        </button>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        {salary && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fcd34d" }}>
            <div className="flex justify-between items-center pb-3 border-b border-amber-200">
              <span className="text-sm font-medium text-slate-600">Employee ID</span>
              <span className="text-sm font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-amber-200">{salary.employee_id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-amber-200">
              <span className="text-sm font-medium text-slate-600">Base Salary</span>
              <span className="text-2xl font-bold text-amber-700">
                {salary.currency} {salary.base_salary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Last Updated</span>
              <span className="text-sm text-slate-500">{salary.last_updated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
