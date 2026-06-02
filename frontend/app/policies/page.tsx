"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:8000/api/policies";

const POLICY_LABELS: Record<string, string> = {
  leave_policy: "Leave Policy",
  salary_policy: "Salary Policy",
  code_of_conduct: "Code of Conduct",
  remote_work_policy: "Remote Work Policy",
  onboarding_policy: "Onboarding Policy",
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/`).then((r) => r.json()).then((d) => setPolicies(d.policies ?? []));
  }, []);

  async function loadPolicy(name: string) {
    setSelected(name);
    setLoading(true);
    const res = await fetch(`${API}/${name}`);
    const data = await res.json();
    setContent(res.ok ? data.content : data.detail);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Policies</h1>
      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-2">
          {policies.map((p) => (
            <button key={p} onClick={() => loadPolicy(p)} className={`w-full text-left text-sm px-4 py-2 rounded-lg transition ${selected === p ? "bg-purple-600 text-white font-semibold" : "bg-white border text-gray-700 hover:bg-purple-50"}`}>
              {POLICY_LABELS[p] ?? p}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl shadow p-6 min-h-[300px]">
          {!selected && <p className="text-gray-400 text-sm">Select a policy from the left to view its contents.</p>}
          {selected && loading && <p className="text-gray-400 text-sm animate-pulse">Loading policy...</p>}
          {selected && !loading && (
            <>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">{POLICY_LABELS[selected] ?? selected}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
