import { MonthlyData } from "../../utils/HeatmapUtils";

type Employee = {
  _id: string;
  name: string;
};

type Props = {
  employee: Employee;
  monthlyData: MonthlyData[];
  onAssign: (month: number) => void;
};

export function EmployeeRow({ employee, monthlyData, onAssign }: Props) {
  if (!employee) return null;

  return (
    <div
      className="grid border-b hover:bg-gray-50"
      style={{ gridTemplateColumns: "250px repeat(12, 140px)" }}
    >
      {/* EMPLOYEE */}
      <div className="p-3 border-r font-medium sticky left-0 bg-white z-10">
        {employee?.name || "Unknown"}
      </div>

      {/* MONTH CELLS */}
      {monthlyData.map((m) => (
        <div
          key={m.month}
          onClick={() => onAssign(m.month)}
          className="border-r p-2 flex items-center justify-center cursor-pointer"
        >
          <div
            className={`w-full h-[95px] rounded-xl p-2 flex flex-col justify-between transition-all hover:shadow-md ${m.color}`}
          >
            {m.hasData ? (
              <>
                {/* PROJECT LIST */}
                <div className="space-y-1 overflow-hidden">
                  {m.projects.slice(0, 3).map((p, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] flex justify-between"
                    >
                      <span className="truncate max-w-[80px]">
                        {p.projectName}
                      </span>
                      <span className="font-semibold">
                        {p.hours}h {p.isBillable ? "🟢" : "⚪"}
                      </span>
                    </div>
                  ))}

                  {m.projects.length > 3 && (
                    <div className="text-[9px] text-gray-500">
                      +{m.projects.length - 3} more
                    </div>
                  )}
                </div>

                {/* SUMMARY */}
                <div className="border-t pt-1 text-[11px] font-semibold flex justify-between">
                  <span>{m.totalHours}h</span>
                  <span>{m.utilizationPct}%</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-400 text-center">—</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}