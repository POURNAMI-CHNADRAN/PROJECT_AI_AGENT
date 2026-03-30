import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex justify-end">
      <div className="w-[420px] bg-white h-full shadow-xl p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-gray-500">
              {employee.employeeId} · {employee.workCategory}
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Capacity Card */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Monthly Capacity</p>
          <p className="text-xl font-bold">
            {booked}h / {capacity}h
          </p>

          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              className={`h-2 rounded ${
                booked < capacity
                  ? "bg-yellow-400"
                  : booked === capacity
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>

          <p className="text-xs mt-2">
            Utilization: <b>{utilization}%</b>
          </p>
        </div>

        {/* Allocations */}
        <h3 className="font-semibold mb-2">Allocations</h3>

        <div className="space-y-3">
          {employee.allocations?.length ? (
            employee.allocations.map((a: any) => (
              <div
                key={a._id}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{a.project.name}</p>
                  <p className="text-xs text-gray-500">
                    {a.isBillable ? "Billable" : "Non‑Billable"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{a.fte || a.allocation}h</p>
                  <p className="text-xs text-gray-500">
                    {a.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-500">
              No active projects (Bench)
            </div>
          )}
        </div>

        {/* Admin / HR Actions */}
        {(employee.role === "Admin" || employee.role === "HR") && (
          <div className="mt-6 space-y-2">
            <button className="w-full px-4 py-2 bg-sky-600 text-white rounded">
              Move Allocation
            </button>

            <button className="w-full px-4 py-2 border rounded">
              Edit Monthly FTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}