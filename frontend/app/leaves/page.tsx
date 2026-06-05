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
    pending:  "bg-amber-500 bg-opacity-20 text-amber-300 border border-amber-500 border-opacity-30",
    approved: "bg-teal-500 bg-opacity-20 text-teal-300 border border-teal-500 border-opacity-30",
    rejected: "bg-rose-500 bg-opacity-20 text-rose-300 border border-rose-500 border-opacity-30",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Leave Requests</h1>

      <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--surface-card)", border: "1px solid #334155" }}>
        <h2 className="text-lg font-semibold mb-4 text-teal-400">Apply for Leave</h2>
        <form onSubmit={submitLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
              <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
            <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} placeholder="Reason for leave..." />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {msg && <p className="text-sm mt-2 text-teal-400 font-medium">{msg}</p>}
        </form>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "var(--surface-card)", border: "1px solid #334155" }}>
        <h2 className="text-lg font-semibold mb-4 text-slate-200">My Leave History</h2>
        {leaves.length === 0 ? (
          <p className="text-slate-500 text-sm">No leave requests found.</p>
        ) : (
          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="rounded-xl p-4 flex justify-between items-start transition-colors" style={{ background: "#0f172a", border: "1px solid #334155" }}>
                <div>
                  <p className="font-medium text-slate-200 text-sm">{l.reason}</p>
                  <p className="text-xs text-slate-500 mt-1">{l.start_date} → {l.end_date}</p>
                  <p className="text-xs text-slate-600">ID: {l.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[l.status] ?? "bg-slate-700 text-slate-400"}`}>
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
