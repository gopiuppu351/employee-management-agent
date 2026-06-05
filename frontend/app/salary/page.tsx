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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Salary Information</h1>

      <div className="card-accent-peach bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-400 mb-5">
          Access is restricted — only you or your manager can view this information.
        </p>
        <button onClick={fetchSalary} disabled={loading} className="bg-orange-400 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-500 disabled:opacity-50 transition mb-6">
          {loading ? "Loading..." : "View My Salary"}
        </button>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        {salary && (
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-orange-100">
              <span className="text-sm text-gray-500">Employee ID</span>
              <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-orange-100">{salary.employee_id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-orange-100">
              <span className="text-sm text-gray-500">Base Salary</span>
              <span className="text-2xl font-semibold text-orange-500">
                {salary.currency} {salary.base_salary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Updated</span>
              <span className="text-sm text-gray-400">{salary.last_updated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
