interface SalaryCardProps {
  employeeId: string;
  baseSalary: number;
  currency: string;
  lastUpdated: string;
}

export default function SalaryCard({ employeeId, baseSalary, currency, lastUpdated }: SalaryCardProps) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 space-y-2">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Employee {employeeId}</p>
      <p className="text-3xl font-semibold text-orange-500">{currency} {baseSalary.toLocaleString()}</p>
      <p className="text-xs text-gray-300">Last updated: {lastUpdated}</p>
    </div>
  );
}
