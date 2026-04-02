import { useState } from "react";
import { useResourceHeatmapData } from "../../hooks/useHeatMapData";
import { mapAllocationsToMonths } from "../../utils/mapAlloctoMonths";
import { EmployeeRow } from "../components/EmployeeRow";
import { AssignEmployeeModal } from "../components/AssignModal";

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
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [assignMonth, setAssignMonth] = useState<number | null>(null);

  const { employees, allocations, loading } =
    useResourceHeatmapData(year);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading Resources…</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto bg-white">
        {/* HEADER */}
        <div className="sticky top-0 flex border-b bg-gray-50 z-10">
          <div className="w-64 p-3 font-semibold border-r">
            Employee
          </div>

          {MONTHS.map(m => (
            <div key={m.month} className="w-40 p-3 text-center border-r">
              <div className="font-semibold">{m.label}</div>
              <div className="text-xs text-gray-500">Hours / Billable</div>
            </div>
          ))}
        </div>

        {/* EMPLOYEE ROWS */}
        {employees.map(emp => {
          const monthlyData = mapAllocationsToMonths(
            allocations,
            emp,
            MONTHS
          );

          return (
            <EmployeeRow
              key={emp._id}
              employee={emp}
              months={MONTHS}
              monthlyData={monthlyData}
              onAssign={(month) => {
                setSelectedEmployee(emp);
                setAssignMonth(month);
              }}
            />
          );
        })}
      </div>

      {/* ASSIGNMENT MODAL */}
      {selectedEmployee && (
        <AssignEmployeeModal
          employee={selectedEmployee}
          month={assignMonth}
          year={year}
          onClose={() => {
            setSelectedEmployee(null);
            setAssignMonth(null);
          }}
        />
      )}
    </div>
  );
}