interface SalaryCardProps {
  employeeId: string;
  baseSalary: number;
  currency: string;
  lastUpdated: string;
}

export default function SalaryCard({ employeeId, baseSalary, currency, lastUpdated }: SalaryCardProps) {
  return (
    <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-2xl p-5 space-y-2">
      <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Employee {employeeId}</p>
      <p className="text-3xl font-bold text-fuchsia-600">{currency} {baseSalary.toLocaleString()}</p>
      <p className="text-xs text-slate-300">Last updated: {lastUpdated}</p>
    </div>
  );
}
