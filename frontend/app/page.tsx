export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Management Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, Alice. Use the navigation to manage your HR tasks.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/chat" className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition border border-blue-100">
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-xl font-semibold text-blue-700 mb-1">Chat with HR Agent</h2>
          <p className="text-gray-500 text-sm">Ask questions about leave, salary, or company policies in natural language.</p>
        </a>

        <a href="/leaves" className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition border border-green-100">
          <div className="text-3xl mb-3">🗓️</div>
          <h2 className="text-xl font-semibold text-green-700 mb-1">Leave Requests</h2>
          <p className="text-gray-500 text-sm">View, submit, and track your leave applications.</p>
        </a>

        <a href="/salary" className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition border border-yellow-100">
          <div className="text-3xl mb-3">💰</div>
          <h2 className="text-xl font-semibold text-yellow-700 mb-1">Salary Information</h2>
          <p className="text-gray-500 text-sm">View your current compensation details.</p>
        </a>

        <a href="/policies" className="block bg-white rounded-xl shadow p-6 hover:shadow-md transition border border-purple-100">
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-xl font-semibold text-purple-700 mb-1">Company Policies</h2>
          <p className="text-gray-500 text-sm">Browse leave, salary, conduct, and remote work policies.</p>
        </a>
      </div>
    </div>
  );
}
