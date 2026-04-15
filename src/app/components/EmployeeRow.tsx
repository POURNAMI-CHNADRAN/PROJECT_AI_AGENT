import { MonthlyData } from "../../utils/HeatmapUtils";

type Employee = {
  _id: string;
  name: string;
  role?: string; // Added for professional context
  avatarUrl?: string;
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
      className="grid border-b border-gray-100 hover:bg-blue-50/30 transition-colors group"
      style={{ gridTemplateColumns: "280px repeat(12, 120px)" }}
    >
      {/* RESOURCE IDENTIFIER */}
      <div className="p-4 border-r border-gray-100 flex items-center gap-3 sticky left-0 bg-white group-hover:bg-[#FDFDFE] z-10">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
          {employee.avatarUrl ? (
            <img src={employee.avatarUrl} alt="" className="object-cover h-full w-full" />
          ) : (
            <span className="text-xs font-bold text-gray-500">
              {employee.name.split(" ").map((n) => n[0]).join("")}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate tracking-tight">
            {employee.name}
          </div>
          <div className="text-[11px] text-gray-500 truncate font-medium uppercase tracking-wider">
            {employee.role || "Resource"}
          </div>
        </div>
      </div>

      {/* MONTH CELLS */}
      {monthlyData.map((m) => (
        <div
          key={m.month}
          onClick={() => onAssign(m.month)}
          className="border-r border-gray-50 p-2 flex items-center justify-center cursor-pointer group/cell relative"
        >
          <div
            className={`w-full h-[100px] rounded-lg p-2.5 flex flex-col justify-between transition-all duration-200 
              ${m.hasData ? `${m.color} ring-1 ring-inset ring-black/5` : 'bg-gray-50/50 hover:bg-gray-100'}`}
          >
            {m.hasData ? (
              <>
                {/* PROJECT LIST */}
                <div className="space-y-1.5 overflow-hidden">
                  {m.projects.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold truncate pr-1 text-gray-800 opacity-90">
                          {p.projectName}
                        </span>
                        <div className={`h-1.5 w-1.5 rounded-full ${p.isBillable ? "bg-green-500" : "bg-gray-400"}`} />
                      </div>
                      <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-black/20 h-full" 
                          style={{ width: `${Math.min((p.hours / 160) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}

                  {m.projects.length > 2 && (
                    <div className="text-[9px] font-bold text-black/40 italic">
                      + {m.projects.length - 2} more
                    </div>
                  )}
                </div>

                {/* CAPACITY SUMMARY */}
                <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-black/5">
                  <span className="text-[10px] font-black uppercase text-black/60">{m.totalHours}h</span>
                  <span className={`text-[11px] font-bold ${m.utilizationPct > 100 ? 'text-red-700' : 'text-black/70'}`}>
                    {m.utilizationPct}%
                  </span>
                </div>
              </>
            ) : (
              <div className="m-auto opacity-0 group-hover/cell:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-blue-600">+ Assign</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}