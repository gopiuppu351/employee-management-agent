interface SalaryCardProps {
  employeeId: string;
  baseSalary: number;
  currency: string;
  lastUpdated: string;
}

export default function SalaryCard({ employeeId, baseSalary, currency, lastUpdated }: SalaryCardProps) {
  return (
    <div className="rounded-xl p-5 space-y-2" style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "1px solid #fcd34d" }}>
      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Employee {employeeId}</p>
      <p className="text-3xl font-bold text-amber-700">{currency} {baseSalary.toLocaleString()}</p>
      <p className="text-xs text-slate-400">Last updated: {lastUpdated}</p>
    </div>
  );
}
