"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatWindowProps {
  employeeId: string;
  apiBase?: string;
}

export default function ChatWindow({ employeeId, apiBase = process.env.NEXT_PUBLIC_API_URL + "/api" }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const msg = input;
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, message: msg }),
      });
      const data = await res.json();
      const reply = res.ok ? data.reply : (data.detail ?? "An error occurred.");
      setMessages((p) => [...p, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((p) => [...p, { role: "assistant", text: "Could not reach the backend." }]);
    }
    
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-3 border border-slate-100 rounded-2xl bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-xl text-sm ${m.role === "user" ? "text-right" : "bg-slate-100 text-slate-700"}`}
            style={m.role === "user" ? { background: "#22d3ee", color: "#0f172a" } : {}}>
            <strong>{m.role === "user" ? "You" : "HR Agent"}:</strong> {m.text}
          </div>
        ))}
        {loading && <div className="text-xs text-slate-300 animate-pulse">Agent is thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <input className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." />
        <button onClick={send} className="text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition" style={{ background: "#22d3ee" }}>Send</button>
      </div>
    </div>
  );
}
