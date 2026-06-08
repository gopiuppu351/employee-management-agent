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
    pending:  "bg-yellow-50 text-yellow-600 border border-yellow-200",
    approved: "bg-green-50 text-green-600 border border-green-200",
    rejected: "bg-red-50 text-red-500 border border-red-200",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Leave Requests</h1>

      <div className="card-accent-lime bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold mb-4 text-lime-600">Apply for Leave</h2>
        <form onSubmit={submitLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Start Date</label>
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-300 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">End Date</label>
              {/* ERROR 3: end_date field is missing the required attribute — users can submit without an end date */}
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-300 bg-slate-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Reason</label>
            <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-300 bg-slate-50" placeholder="Reason for leave..." />
          </div>
          <button type="submit" disabled={loading} className="bg-lime-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-lime-600 disabled:opacity-50 transition">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {msg && <p className="text-sm mt-2 text-lime-600 font-medium">{msg}</p>}
        </form>
      </div>

      <div className="card-accent-cyan bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-semibold mb-4 text-slate-700">My Leave History</h2>
        {leaves.length === 0 ? (
          <p className="text-slate-400 text-sm">No leave requests found.</p>
        ) : (
          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="border border-slate-100 rounded-xl p-4 flex justify-between items-start hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{l.reason}</p>
                  <p className="text-xs text-slate-400 mt-1">{l.start_date} → {l.end_date}</p>
                  <p className="text-xs text-slate-300">ID: {l.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[l.status] ?? "bg-slate-100 text-slate-500"}`}>
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
