"use client";
import { useState } from "react";

interface LeaveFormProps {
  employeeId: string;
  onSuccess?: () => void;
}

export default function LeaveForm({ employeeId, onSuccess }: LeaveFormProps) {
  const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Submitting...");
    const res = await fetch("http://localhost:8000/api/leaves/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Leave submitted!");
      setForm({ start_date: "", end_date: "", reason: "" });
      onSuccess?.();
    } else {
      setStatus(`Error: ${data.detail}`);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none" />
      <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none" />
      <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none" placeholder="Reason..." rows={2} />
      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full hover:bg-emerald-700 transition">Apply for Leave</button>
      {status && <p className="text-xs text-emerald-600 font-medium">{status}</p>}
    </form>
  );
}
