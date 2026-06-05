"use client";
import { useState, useRef, useEffect } from "react";

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
    { role: "assistant", text: "Hello! I'm your HR Assistant. I can help you with leave requests, salary inquiries, and company policies. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const employeeId = "E001";

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
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, message: msg }),
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">HR Assistant</h1>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => sendMessage(s)} className="text-xs bg-white border border-gray-200 text-gray-500 rounded-full px-3 py-1.5 hover:border-sky-300 hover:text-sky-600 transition">
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-sky-500 text-white rounded-br-none"
                : "bg-gray-100 text-gray-700 rounded-bl-none"
            }`}>
              <span className="block font-medium mb-1 text-xs opacity-60">{m.role === "user" ? "You" : "HR Agent"}</span>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 p-3 rounded-xl text-sm rounded-bl-none animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about leave, salary, or policies..."
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="bg-sky-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
