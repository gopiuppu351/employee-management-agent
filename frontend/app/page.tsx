export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Employee Dashboard</h1>
      <p className="text-sm text-gray-400 mb-8">Welcome back, Alice. Here's everything in one place.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <a href="/chat" className="card-accent-sky block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-lg mb-4">💬</div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Chat with HR Agent</h2>
          <p className="text-sm text-gray-400">Ask questions about leave, salary, or company policies.</p>
          <span className="mt-4 inline-block text-xs font-medium text-sky-500">Open chat →</span>
        </a>

        <a href="/leaves" className="card-accent-mint block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-lg mb-4">🗓️</div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Leave Requests</h2>
          <p className="text-sm text-gray-400">View, submit, and track your leave applications.</p>
          <span className="mt-4 inline-block text-xs font-medium text-emerald-500">Manage leaves →</span>
        </a>

        <a href="/salary" className="card-accent-peach block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-lg mb-4">💰</div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Salary Information</h2>
          <p className="text-sm text-gray-400">View your current compensation details.</p>
          <span className="mt-4 inline-block text-xs font-medium text-orange-400">View salary →</span>
        </a>

        <a href="/policies" className="card-accent-lilac block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-lg mb-4">📋</div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Company Policies</h2>
          <p className="text-sm text-gray-400">Browse leave, salary, conduct, and remote work policies.</p>
          <span className="mt-4 inline-block text-xs font-medium text-violet-400">Browse policies →</span>
        </a>

      </div>
    </div>
  );
}
