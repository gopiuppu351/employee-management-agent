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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Salary Information</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-500 mb-4">
          View your current compensation details. Access is restricted — only you or your manager can see this information.
        </p>
        <button onClick={fetchSalary} disabled={loading} className="bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 transition mb-6">
          {loading ? "Loading..." : "View My Salary"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {salary && (
          <div className="border rounded-xl p-5 bg-yellow-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Employee ID</span>
              <span className="text-sm font-bold text-gray-800">{salary.employee_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Base Salary</span>
              <span className="text-2xl font-bold text-yellow-700">
                {salary.currency} {salary.base_salary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-500">{salary.last_updated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
