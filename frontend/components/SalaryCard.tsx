interface SalaryCardProps {
  employeeId: string;
  baseSalary: number;
  currency: string;
  lastUpdated: string;
}

export default function SalaryCard({ employeeId, baseSalary, currency, lastUpdated }: SalaryCardProps) {
  return (
    <div className="rounded-xl p-5 space-y-2" style={{ background: "linear-gradient(135deg, #1c1408, #271a08)", border: "1px solid #92400e" }}>
      <p className="text-xs text-amber-500 uppercase tracking-widest font-semibold">Employee {employeeId}</p>
      <p className="text-3xl font-bold text-amber-300">{currency} {baseSalary.toLocaleString()}</p>
      <p className="text-xs text-slate-500">Last updated: {lastUpdated}</p>
    </div>
  );
}
