import { useState, useMemo } from "react";
import useResourceHeatmapData from "../../hooks/useHeatMapData";
import { mapAllocationsToMonths } from "../../utils/HeatmapUtils";
import { EmployeeRow } from "../components/EmployeeRow";

const MONTHS = [
  { month: 1, label: "Jan" }, { month: 2, label: "Feb" },
  { month: 3, label: "Mar" }, { month: 4, label: "Apr" },
  { month: 5, label: "May" }, { month: 6, label: "Jun" },
  { month: 7, label: "Jul" }, { month: 8, label: "Aug" },
  { month: 9, label: "Sep" }, { month: 10, label: "Oct" },
  { month: 11, label: "Nov" }, { month: 12, label: "Dec" },
];

export default function HeatmapScheduler() {
  const [year] = useState(2026);
  const { employees, allocations, loading, error } = useResourceHeatmapData(year);

  // SaaS touches: Loading skeletons provide a better UX than plain text
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Resource Map...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 max-w-md mx-auto mt-20 bg-red-50 border border-red-200 rounded-xl text-center">
      <p className="text-red-600 font-semibold">System Error</p>
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB]">
      {/* TOP NAVIGATION BAR */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Resource Planner</h1>
          <p className="text-sm text-gray-500">Fiscal Year {year}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition">Export</button>
          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition">
            Add Allocation
          </button>
        </div>
      </header>

      {/* HEATMAP CONTAINER */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <div className="inline-block min-w-full align-middle">
          <div className="relative border-b border-gray-200">
            {/* STICKY HEADER */}
            <div 
              className="grid sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b shadow-sm"
              style={{ gridTemplateColumns: "280px repeat(12, 120px)" }}
            >
              <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider sticky left-0 bg-white/90 z-30 border-r">
                Resource Name
              </div>
              {MONTHS.map((m) => (
                <div key={m.month} className="p-4 text-center border-r border-gray-100 last:border-r-0">
                  <span className="block text-sm font-bold text-gray-700">{m.label}</span>
                  <span className="block text-[10px] text-gray-400 font-medium">CAPACITY</span>
                </div>
              ))}
            </div>

            {/* BODY / ROWS */}
            <div className="divide-y divide-gray-100 bg-white">
              {employees.length === 0 ? (
                <div className="p-20 text-center text-gray-400">No resources found for this period.</div>
              ) : (
                employees.map((emp) => {
                  if (!emp) return null;

                  // Memoize allocations per employee to prevent unnecessary re-filters
                  const empAllocations = allocations.filter((a) => a.employeeId === emp._id);
                  const monthlyData = mapAllocationsToMonths(empAllocations, MONTHS, year);

                  return (
                    <EmployeeRow
                      key={emp._id}
                      employee={emp}
                      monthlyData={monthlyData}
                      onAssign={(month) => console.log("Open Modal for:", emp.name, month)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}