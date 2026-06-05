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
      <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} />
      <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} />
      <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#0f172a", border: "1px solid #334155" }} placeholder="Reason..." rows={2} />
      <button type="submit" className="text-white px-4 py-2 rounded-lg text-sm font-semibold w-full transition" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>Apply for Leave</button>
      {status && <p className="text-xs text-teal-400 font-medium">{status}</p>}
    </form>
  );
}
