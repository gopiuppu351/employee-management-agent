export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-900 mb-1">Employee Management Dashboard</h1>
      <p className="text-indigo-400 mb-8 text-sm">Welcome back, Alice. Use the navigation to manage your HR tasks.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat */}
        <a
          href="/chat"
          className="card-accent-indigo block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-indigo-100"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl mb-4">💬</div>
          <h2 className="text-lg font-semibold text-indigo-700 mb-1">Chat with HR Agent</h2>
          <p className="text-slate-500 text-sm">Ask questions about leave, salary, or company policies in natural language.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-indigo-500 uppercase tracking-wide">Open Chat →</span>
        </a>

        {/* Leaves */}
        <a
          href="/leaves"
          className="card-accent-emerald block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-emerald-100"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl mb-4">🗓️</div>
          <h2 className="text-lg font-semibold text-emerald-700 mb-1">Leave Requests</h2>
          <p className="text-slate-500 text-sm">View, submit, and track your leave applications.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-emerald-500 uppercase tracking-wide">Manage Leaves →</span>
        </a>

        {/* Salary */}
        <a
          href="/salary"
          className="card-accent-amber block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-amber-100"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-xl mb-4">💰</div>
          <h2 className="text-lg font-semibold text-amber-700 mb-1">Salary Information</h2>
          <p className="text-slate-500 text-sm">View your current compensation details.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-amber-500 uppercase tracking-wide">View Salary →</span>
        </a>

        {/* Policies */}
        <a
          href="/policies"
          className="card-accent-violet block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-violet-100"
        >
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-violet-700 mb-1">Company Policies</h2>
          <p className="text-slate-500 text-sm">Browse leave, salary, conduct, and remote work policies.</p>
          <span className="mt-4 inline-block text-xs font-semibold text-violet-500 uppercase tracking-wide">Browse Policies →</span>
        </a>
      </div>
    </div>
  );
}
