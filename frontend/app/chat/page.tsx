"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "What is my current salary?",
  "Apply for leave June 10–14.",
  "What is the leave policy?",
  "Tell me about remote work policy.",
  "List all pending leave requests.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm your HR Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: user.employeeId, message: msg }),
      });
      const data = await res.json();
      const reply = res.ok ? data.reply : (data.detail ?? "An error occurred.");
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Could not reach the backend." }]);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">HR Assistant</h1>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => sendMessage(s)} className="text-xs bg-white border border-slate-200 text-slate-500 rounded-full px-3 py-1.5 hover:border-cyan-300 hover:text-cyan-600 transition">
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "text-white rounded-br-none"
                : "bg-slate-100 text-slate-700 rounded-bl-none"
            }`} style={m.role === "user" ? { background: "#22d3ee", color: "#0f172a" } : {}}>
              <span className="block font-semibold mb-1 text-xs opacity-60">{m.role === "user" ? "You" : "HR Agent"}</span>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl text-sm rounded-bl-none animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about leave, salary, or policies..."
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="text-slate-900 px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
          style={{ background: "#22d3ee" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
