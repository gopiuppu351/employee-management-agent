"use client";
import { useState, useEffect } from "react";

interface Leave {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at?: string;
  approved_by?: string;
}

const API = "http://localhost:8000/api/leaves";
const EMPLOYEE_ID = "E001";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchLeaves() {
    const res = await fetch(`${API}/?employee_id=${EMPLOYEE_ID}`);
    const data = await res.json();
    setLeaves(data);
  }

  useEffect(() => { fetchLeaves(); }, []);

  async function submitLeave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: EMPLOYEE_ID, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Leave request submitted successfully!");
        setForm({ start_date: "", end_date: "", reason: "" });
        fetchLeaves();
      } else {
        setMsg(`Error: ${data.detail}`);
      }
    } catch {
      setMsg("Could not reach the backend.");
    }
    setLoading(false);
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Apply for Leave</h2>
        <form onSubmit={submitLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
            <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none" placeholder="Reason for leave..." />
          </div>
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {msg && <p className="text-sm mt-2 text-blue-600">{msg}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">My Leave History</h2>
        {leaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No leave requests found.</p>
        ) : (
          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{l.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">{l.start_date} → {l.end_date}</p>
                  <p className="text-xs text-gray-400">ID: {l.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
