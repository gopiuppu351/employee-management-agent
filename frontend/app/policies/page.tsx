"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api/policies";

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
    async function fetchPolicies() {
      try {
        const response = await fetch(`${API}/`);
        const data = await response.json();
        if (response.ok) {
          setPolicies(data.policies ?? []);
        } else {
          console.error("Failed to fetch policies:", data.detail);
        }
      } catch (error) {
        console.error("Could not fetch policies:", error);
      }
    }
    fetchPolicies();
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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Company Policies</h1>
      <div className="flex gap-5">
        <div className="w-48 shrink-0 space-y-1.5">
          {policies.map((p) => (
            <button
              key={p}
              onClick={() => loadPolicy(p)}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition font-medium ${
                selected === p
                  ? "text-white shadow-sm"
                  : "bg-white border border-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-100"
              }`}
              style={selected === p ? { background: "#fb923c" } : {}}
            >
              {POLICY_LABELS[p] ?? p}
            </button>
          ))}
        </div>

        <div className="card-accent-orange flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[300px]">
          {!selected && <p className="text-slate-300 text-sm">Select a policy from the left.</p>}
          {selected && loading && <p className="text-slate-400 text-sm animate-pulse">Loading...</p>}
          {selected && !loading && (
            <>
              <h2 className="text-base font-semibold text-orange-500 mb-3">{POLICY_LABELS[selected] ?? selected}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
