import { useState } from "react";
import { apiPatch } from "../../lib/api";
import useResourceHeatmapData from "../../hooks/useHeatMapData";
import { EmployeeSidebar } from "../components/EmpSidebar";
import { buildDepartments } from "../../utils/buildDepts";

interface Employee {
  _id: string;
  name: string;
  departmentId?: { _id: string; name: string };
}

export function WorkloadManager() {
  const year = 2026;

  const {
    employees = [],
    allocations = [],
    departments = [],
    loading,
  } = useResourceHeatmapData(year);

  const sidebarDepartments = buildDepartments(departments, employees);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const CAPACITY = 160;

  if (loading) {
    return <div className="p-6 text-gray-500">Loading workload…</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* ✅ SIDEBAR */}
      <EmployeeSidebar
        departments={sidebarDepartments}
        selectedEmployeeId={selectedEmployee?._id}
        onEmployeeSelect={(id) => {
          const emp = employees.find((e) => e._id === id);
          setSelectedEmployee(emp || null);
        }}
      />

      {/* ✅ MAIN */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-4">
          Workload Manager
        </h1>

        <div className="bg-white rounded-xl shadow border divide-y">
          {employees.map((emp) => {
            const empAllocations = allocations.filter(
              (a) =>
                a.employeeId === emp._id &&
                Number(a.year) === year
            );

            const totalHours = empAllocations.reduce(
              (sum, a) => sum + Number(a.allocatedHours || 0),
              0
            );

            const utilizationPct =
              totalHours > 0
                ? Math.round((totalHours / CAPACITY) * 100)
                : 0;

            let status: "Optimal" | "Underbilled" | "Overbilled";

            if (utilizationPct > 100) status = "Overbilled";
            else if (utilizationPct < 60) status = "Underbilled";
            else status = "Optimal";

            return (
              <div
                key={emp._id}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition"
              >
                {/* EMPLOYEE */}
                <div>
                  <div className="font-medium">
                    {emp.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {emp.departmentId?.name || "—"}
                  </div>
                </div>

                {/* UTILIZATION */}
                <div className="flex items-center gap-6">
                  
                  {/* 🔥 PROGRESS BAR */}
                  <div className="w-32">
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded ${
                          status === "Overbilled"
                            ? "bg-red-500"
                            : status === "Underbilled"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(utilizationPct, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {utilizationPct}%
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      status === "Overbilled"
                        ? "bg-red-100 text-red-700"
                        : status === "Underbilled"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {status}
                  </span>

                  {/* ACTION */}
                  {status !== "Optimal" && (
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

        {/* ✅ MODAL */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[420px] space-y-4 shadow-xl">
              <h2 className="text-lg font-semibold">
                Reassign tasks from {selectedEmployee.name}
              </h2>

              <p className="text-sm text-gray-500">
                Choose another employee to take over tasks.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  className="border px-4 py-2 rounded"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Cancel
                </button>

                <button
                  className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
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