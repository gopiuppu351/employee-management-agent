// Dashboard: main entry point for the Employee Management Agent
export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-1">Employee Management Dashboard</h1>
      <p className="text-slate-400 mb-8 text-sm">Welcome back, Alice. Use the navigation to manage your HR tasks.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Chat */}
        <a
          href="/chat"
          className="block rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 4px 24px rgba(13,148,136,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl mb-4">💬</div>
          <h2 className="text-lg font-semibold text-white mb-1">Chat with HR Agent</h2>
          <p className="text-teal-100 text-sm">Ask questions about leave, salary, or company policies in natural language.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-teal-200 uppercase tracking-wide">Open Chat →</span>
        </a>

        {/* Leaves */}
        <a
          href="/leaves"
          className="block rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)", boxShadow: "0 4px 24px rgba(225,29,72,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl mb-4">🗓️</div>
          <h2 className="text-lg font-semibold text-white mb-1">Leave Requests</h2>
          <p className="text-rose-100 text-sm">View, submit, and track your leave applications.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-rose-200 uppercase tracking-wide">Manage Leaves →</span>
        </a>

        {/* Salary */}
        <a
          href="/salary"
          className="block rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", boxShadow: "0 4px 24px rgba(217,119,6,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl mb-4">💰</div>
          <h2 className="text-lg font-semibold text-white mb-1">Salary Information</h2>
          <p className="text-amber-100 text-sm">View your current compensation details.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-amber-200 uppercase tracking-wide">View Salary →</span>
        </a>

        {/* Policies */}
        <a
          href="/policies"
          className="block rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", boxShadow: "0 4px 24px rgba(124,58,237,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-white mb-1">Company Policies</h2>
          <p className="text-violet-100 text-sm">Browse leave, salary, conduct, and remote work policies.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-violet-200 uppercase tracking-wide">Browse Policies →</span>
        </a>
      </div>
    </div>
  );
}
