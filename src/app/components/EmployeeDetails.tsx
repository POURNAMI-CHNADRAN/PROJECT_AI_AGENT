import { X, Briefcase, ArrowRightLeft, Edit3 } from "lucide-react";

export default function EmployeeDetails({
  employee,
  onClose,
}: {
  employee: any;
  onClose: () => void;
}) {
  const capacity = 160;
  const booked = employee.totalFTE || 0;
  const utilization = Math.round((booked / capacity) * 100);

  const utilizationColor =
    booked < capacity
      ? "bg-yellow-400"
      : booked === capacity
      ? "bg-green-500"
      : "bg-red-500";

  const utilizationLabel =
    booked < capacity
      ? "Underutilized"
      : booked === capacity
      ? "Optimal"
      : "Overallocated";

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
      <div className="w-[440px] bg-white h-full shadow-2xl flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {employee.name}
            </h2>
            <p className="text-sm text-gray-500">
              {employee.employeeId} · {employee.workCategoryName || "Unassigned"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ===== Utilization Card ===== */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Monthly Capacity</p>
              <span className="text-xs px-2 py-0.5 rounded bg-white border">
                {utilizationLabel}
              </span>
            </div>

            <p className="text-2xl font-bold text-gray-900">
              {booked}h / {capacity}h
            </p>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${utilizationColor}`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>

            <p className="text-xs text-gray-600">
              Utilization: <b>{utilization}%</b>
            </p>
          </div>

          {/* ===== Allocation Section ===== */}
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Briefcase size={16} />
              Allocations
            </h3>

            {employee.allocations?.length ? (
              <div className="space-y-3">
                {employee.allocations.map((a: any) => (
                  <div
                    key={a._id}
                    className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {a.project?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.isBillable ? "Billable" : "Non‑Billable"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {a.fte || a.allocation}h
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.month}/{a.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                No active allocations — this employee is currently on bench.
              </div>
            )}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        {(employee.role === "Admin" || employee.role === "HR") && (
          <div className="p-6 border-t bg-gray-50 space-y-2">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            >
              <ArrowRightLeft size={16} />
              Move Allocation
            </button>

            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-white transition"
            >
              <Edit3 size={16} />
              Edit Monthly FTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
