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
      <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" />
      <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" />
      <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="Reason..." rows={2} />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm w-full">Apply for Leave</button>
      {status && <p className="text-xs text-blue-600">{status}</p>}
    </form>
  );
}
