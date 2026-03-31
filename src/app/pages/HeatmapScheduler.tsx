import { useResourceData } from "../../hooks/useResourceData";

export function HeatmapScheduler() {
  const { employees } = useResourceData(3, 2026);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {employees.map(emp => {
        const pct = Math.round((emp.totalFTE / 160) * 100);
        const color =
          pct > 100 ? "bg-red-400" :
          pct > 80 ? "bg-yellow-400" :
          "bg-green-400";

        return (
          <div key={emp._id} className="flex items-center gap-4 py-2">
            <div className="w-40">{emp.name}</div>
            <div className={`${color} h-6 w-full rounded`} />
            <div className="w-12 text-xs">{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}