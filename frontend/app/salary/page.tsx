"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";

const API = process.env.NEXT_PUBLIC_API_URL + "/api/salaries";

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
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  async function fetchSalary() {
    setLoading(true);
    setError("");
    setSalary(null);

    // Determine which employee's salary to fetch
    const employeeToFetch = targetEmployeeId || user.employeeId;
    
    // Only allow managers to view other employees' salaries
    if (targetEmployeeId && targetEmployeeId !== user.employeeId && user.role !== "manager") {
      setError("Only managers can view other employees' salaries.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/${employeeToFetch}?requester_id=${user.employeeId}`);
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
          {user.role === "manager" 
            ? "View salary information for yourself or your team members." 
            : "View your current compensation details."
          }
        </p>
        
        {user.role === "manager" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Employee ID (leave empty for your own salary)
            </label>
            <input
              type="text"
              value={targetEmployeeId}
              onChange={(e) => setTargetEmployeeId(e.target.value.trim())}
              placeholder="Enter employee ID or leave empty"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
            />
          </div>
        )}
        
        <button 
          onClick={fetchSalary} 
          disabled={loading} 
          className="px-6 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition mb-6" 
          style={{ background: "#e879f9" }}
        >
          {loading ? "Loading..." : `View ${targetEmployeeId ? 'Employee' : 'My'} Salary`}
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
