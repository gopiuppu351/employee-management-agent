// v6 — UI tweak: updated welcome message and card descriptions
export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#1e293b" }}>Employee Management Portal</h1>
      <p className="text-sm text-slate-400 mb-8">Good to see you, Alice. What would you like to manage today?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <a href="/chat" className="card-accent-cyan block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-xl mb-4">💬</div>
          <h2 className="text-base font-semibold text-slate-800 mb-1">Chat with HR Agent</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Get instant answers about leave, salary, and HR policies.</p>
          <span className="mt-4 inline-block text-xs font-bold text-cyan-500 uppercase tracking-wide">Open chat →</span>
        </a>

        <a href="/leaves" className="card-accent-lime block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center text-xl mb-4">🗓️</div>
          <h2 className="text-base font-semibold text-slate-800 mb-1">Leave Requests</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Apply for leave and track all your requests in one place.</p>
          <span className="mt-4 inline-block text-xs font-bold text-lime-500 uppercase tracking-wide">Manage leaves →</span>
        </a>

        <a href="/salary" className="card-accent-fuchsia block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center text-xl mb-4">💰</div>
          <h2 className="text-base font-semibold text-slate-800 mb-1">Salary Information</h2>
          <p className="text-sm text-slate-400 leading-relaxed">View your current compensation details.</p>
          <span className="mt-4 inline-block text-xs font-bold text-fuchsia-500 uppercase tracking-wide">View salary →</span>
        </a>

        <a href="/policies" className="card-accent-orange block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl mb-4">📋</div>
          <h2 className="text-base font-semibold text-slate-800 mb-1">Company Policies</h2>
          <p className="text-sm text-slate-400 leading-relaxed">Browse leave, salary, conduct, and remote work policies.</p>
          <span className="mt-4 inline-block text-xs font-bold text-orange-400 uppercase tracking-wide">Browse policies →</span>
        </a>

      </div>
    </div>
  );
}
