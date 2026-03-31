export function StatusBadge({ status }: any) {
  const map: any = {
    Underbilled: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Optimal: "bg-green-50 text-green-700 border-green-200",
    Overbilled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`px-3 py-1 text-xs border rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}