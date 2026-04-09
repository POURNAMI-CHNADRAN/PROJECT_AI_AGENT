import { useState } from "react";
import useResourceHeatmapData from "../../hooks/useHeatMapData";
import { mapAllocationsToMonths } from "../../utils/HeatmapUtils";
import { EmployeeRow } from "../components/EmployeeRow";

const MONTHS = [
  { month: 1, label: "Jan" },
  { month: 2, label: "Feb" },
  { month: 3, label: "Mar" },
  { month: 4, label: "Apr" },
  { month: 5, label: "May" },
  { month: 6, label: "Jun" },
  { month: 7, label: "Jul" },
  { month: 8, label: "Aug" },
  { month: 9, label: "Sep" },
  { month: 10, label: "Oct" },
  { month: 11, label: "Nov" },
  { month: 12, label: "Dec" },
];

export default function HeatmapScheduler() {
  const [year] = useState(2026);

  const { employees, allocations, loading, error } =
    useResourceHeatmapData(year);

  console.log("EMPLOYEES:", employees);
  console.log("ALLOCATIONS:", allocations);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto bg-white">

        {/* HEADER */}
        <div className="sticky top-0 z-10 flex border-b bg-gray-100">
          <div className="w-64 p-3 font-semibold border-r">
            Employee
          </div>

          {MONTHS.map((m) => (
            <div key={m.month} className="w-40 p-3 text-center border-r">
              <div className="font-semibold">{m.label}</div>
              <div className="text-xs text-gray-500">
                Hours / Billable
              </div>
            </div>
          ))}
        </div>

        {/* ROWS */}
        {employees.map((emp) => {
          const empAllocations = allocations.filter(
            (a) => String(a.employeeId) === String(emp._id)
          );

          const monthlyData = mapAllocationsToMonths(
            empAllocations,
            MONTHS,
            year
          );

          return (
            <EmployeeRow
              key={emp._id}
              employee={emp}
              monthlyData={monthlyData}
              onAssign={(month: number) =>
                console.log("Assign clicked", emp.name, month)
              }
            />
          );
        })}
      </div>
    </div>
  );
}