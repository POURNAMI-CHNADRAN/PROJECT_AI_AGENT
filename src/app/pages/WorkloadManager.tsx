import { useState } from "react";
import { apiPatch } from "../../lib/api";
import { EmployeeSidebar } from "../components/EmpSidebar";
import { buildDepartments } from "../../utils/buildDepts";
import { useResourceHeatmapData } from "../../hooks/useHeatMapData";

interface Employee {
  _id: string;
  name: string;
  departmentId?: { name: string };
  totalFTE: number;
  utilizationStatus: "Optimal" | "Underbilled" | "Overbilled";
}

export function WorkloadManager() {
  const year = 2026;

  // ✅ Use the same enriched data as HeatmapScheduler
  const { employees, departments, loading } =
    useResourceHeatmapData(0, year);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const sidebarDepartments = buildDepartments(departments, employees);

  const reassignTask = async (empId: string) => {
    if (!selectedEmployee) return;

    await apiPatch(`/api/tasks/${selectedEmployee._id}/reassign`, {
      assigneeId: empId,
    });

    setSelectedEmployee(null);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading workload…</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <EmployeeSidebar departments={sidebarDepartments} />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-4">
          Workload Manager
        </h1>

        <div className="bg-white rounded-xl shadow border divide-y">
          {employees.map((emp: Employee) => {
            const utilizationPct = Math.round(
              (emp.totalFTE / 160) * 100
            );

            return (
              <div
                key={emp._id}
                className="flex justify-between items-center px-4 py-3"
              >
                {/* Employee Info */}
                <div>
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-xs text-gray-500">
                    {emp.departmentId?.name}
                  </div>
                </div>

                {/* Utilization */}
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    {utilizationPct}%
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      emp.utilizationStatus === "Overbilled"
                        ? "bg-red-100 text-red-700"
                        : emp.utilizationStatus === "Underbilled"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {emp.utilizationStatus}
                  </span>

                  {/* Action */}
                  {emp.utilizationStatus !== "Optimal" && (
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Reassign
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTION MODAL PLACEHOLDER */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
              <h2 className="text-lg font-semibold">
                Reassign tasks from {selectedEmployee.name}
              </h2>

              <p className="text-sm text-gray-500">
                Choose another employee to take over tasks.
              </p>

              {/* Later: employee picker */}

              <div className="flex justify-end gap-2">
                <button
                  className="border px-4 py-2 rounded"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-sky-600 text-white px-4 py-2 rounded"
                  disabled
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}