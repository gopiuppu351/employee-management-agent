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
      <h1 className="text-2xl font-bold text-white mb-6">Company Policies</h1>
      <div className="flex gap-5">
        <div className="w-52 shrink-0 space-y-2">
          {policies.map((p) => (
            <button
              key={p}
              onClick={() => loadPolicy(p)}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition font-medium ${
                selected === p
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={selected === p
                ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", border: "1px solid #7c3aed" }
                : { background: "var(--surface-card)", border: "1px solid #334155" }
              }
            >
              {POLICY_LABELS[p] ?? p}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-2xl p-6 min-h-[300px]" style={{ background: "var(--surface-card)", border: "1px solid #334155" }}>
          {!selected && <p className="text-slate-500 text-sm">Select a policy from the left to view its contents.</p>}
          {selected && loading && <p className="text-slate-500 text-sm animate-pulse">Loading policy...</p>}
          {selected && !loading && (
            <>
              <h2 className="text-lg font-semibold text-violet-400 mb-4">{POLICY_LABELS[selected] ?? selected}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
