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

export default function ChatWindow({ employeeId, apiBase = "http://localhost:8000/api" }: ChatWindowProps) {
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
    const res = await fetch(`${apiBase}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, message: msg }),
    });
    const data = await res.json();
    setMessages((p) => [...p, { role: "assistant", text: res.ok ? data.reply : data.detail }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-3 border border-gray-100 rounded-xl bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-lg text-sm ${m.role === "user" ? "bg-sky-100 text-sky-900 text-right" : "bg-gray-100 text-gray-700"}`}>
            <strong>{m.role === "user" ? "You" : "HR Agent"}:</strong> {m.text}
          </div>
        ))}
        {loading && <div className="text-xs text-gray-300 animate-pulse">Agent is thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." />
        <button onClick={send} className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 transition">Send</button>
      </div>
    </div>
  );
}
