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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Company Policies</h1>
      <div className="flex gap-5">
        <div className="w-48 shrink-0 space-y-1.5">
          {policies.map((p) => (
            <button
              key={p}
              onClick={() => loadPolicy(p)}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-lg transition font-medium ${
                selected === p
                  ? "bg-violet-500 text-white"
                  : "bg-white border border-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600"
              }`}
            >
              {POLICY_LABELS[p] ?? p}
            </button>
          ))}
        </div>

        <div className="card-accent-lilac flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[300px]">
          {!selected && <p className="text-gray-300 text-sm">Select a policy from the left.</p>}
          {selected && loading && <p className="text-gray-400 text-sm animate-pulse">Loading...</p>}
          {selected && !loading && (
            <>
              <h2 className="text-base font-semibold text-violet-600 mb-3">{POLICY_LABELS[selected] ?? selected}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
