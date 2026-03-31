import { cn } from "../components/ui/utils";

/* ================= CONSTANTS ================= */

const WEEKS = [
  { label: "W1", range: "1–7" },
  { label: "W2", range: "8–14" },
  { label: "W3", range: "15–21" },
  { label: "W4", range: "22–28" },
  { label: "W5", range: "29–31" },
];

const projectColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
];

/* ================= COMPONENT ================= */

export function ResourcePlanningGrid({
  employees,
  onSelectEmployee,
}: {
  employees: any[];
  onSelectEmployee?: (emp: any) => void;
}) {
  const grouped = groupByRole(employees);

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex border-b bg-gray-50">
        <div className="w-72 shrink-0 border-r px-4 py-3 text-sm font-medium">
          Team Members
        </div>

        <div className="flex overflow-x-auto">
          {WEEKS.map(w => (
            <div
              key={w.label}
              className="w-40 shrink-0 px-4 py-2 text-center border-r"
            >
              <div className="text-xs text-gray-400">{w.range}</div>
              <div className="font-medium">{w.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-h-[520px] overflow-y-auto">

        {Object.entries(grouped).map(([role, members]: any) => (
          <div key={role}>
            {/* ROLE HEADER */}
            <div className="bg-gray-50 px-4 py-2 text-sm font-medium border-b">
              {role}
              <span className="ml-1 text-xs text-gray-400">
                {members.length}
              </span>
            </div>

            {/* MEMBERS */}
            {members.map((emp: any) => (
              <div
                key={emp._id}
                className="flex border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectEmployee?.(emp)}
              >

                {/* LEFT EMPLOYEE CELL */}
                <div className="w-72 shrink-0 border-r px-4 py-3">
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-xs text-gray-400">
                    {emp.employeeId}
                  </div>

                  <span
                    className={cn(
                      "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
                      emp.utilizationStatus === "Optimal"
                        ? "bg-green-100 text-green-700"
                        : emp.utilizationStatus === "Underutilized"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {emp.utilizationStatus === "Optimal"
                      ? "Fully Allocated"
                      : "Available"}
                  </span>
                </div>

                {/* WEEK CELLS */}
                <div className="flex overflow-x-auto">
                  {WEEKS.map((w, i) => {
                    const alloc = emp.weeklyAllocations?.find(
                      (a: any) => a.week === w.label
                    );

                    return (
                      <div
                        key={w.label}
                        className="w-40 shrink-0 px-3 py-2 border-r"
                      >
                        {alloc ? (
                          <div
                            className={cn(
                              "rounded-lg px-2 py-1 text-xs font-medium",
                              projectColors[i % projectColors.length]
                            )}
                          >
                            {alloc.project}
                            <div className="text-right text-[11px]">
                              {alloc.hours}h
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-300 h-full flex items-center justify-center">
                            —
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function groupByRole(employees: any[]) {
  return employees.reduce((acc: any, e: any) => {
    const role = e.role || "Unassigned";
    acc[role] = acc[role] || [];
    acc[role].push(e);
    return acc;
  }, {});
}