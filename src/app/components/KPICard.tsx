export function KpiCard({ label, value, icon, trend }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="bg-sky-100 p-2 rounded-lg">{icon}</div>
      </div>

      <div className="text-2xl font-semibold mt-3">{value}</div>

      {trend && (
        <div className="text-xs text-green-600 mt-1">
          ↑ {trend}
        </div>
      )}
    </div>
  );
}