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

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="h-screen bg-gray-50 overflow-auto">
      {/* HEADER */}
      <div
        className="grid border-b bg-gray-100 sticky top-0 z-20"
        style={{ gridTemplateColumns: "250px repeat(12, 140px)" }}
      >
        <div className="p-3 font-semibold border-r sticky left-0 bg-gray-100 z-30">
          Employee
        </div>

        {MONTHS.map((m) => (
          <div key={m.month} className="p-3 text-center border-r">
            <div className="font-semibold">{m.label}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
        ))}
      </div>

      {/* ROWS */}
      {employees.map((emp) => {
        if (!emp) return null;

        const empAllocations =
          allocations.filter((a) => a.employeeId === emp._id) || [];

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
            onAssign={(month) =>
              console.log("Assign", emp.name, month)
            }
          />
        );
      })}
    </div>
  );
}