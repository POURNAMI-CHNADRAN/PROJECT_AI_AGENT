// // import { useState } from "react";
// // import { ZoomIn, ZoomOut, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
// // import { EmployeeSidebar } from "../components/EmpSidebar";
// // import { AllocationCell } from "../components/AllocationCell";
// // import { Button } from "../components/ui/button";
// // import { Switch } from "../components/ui/switch";
// // import { Label } from "../components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "../components/ui/select";
// // import { Avatar, AvatarFallback } from "../components/ui/avatar";

// // import { useHeatmapData } from "../../hooks/useHeatMapData";
// // import { mapAllocationsToWeeks } from "../../utils/mapAlloctoWeeks";

// // /* ---------------- UTIL ---------------- */
// // function generateWeeks(count: number) {
// //   return Array.from({ length: count }).map((_, i) => ({
// //     index: i,
// //     label: `W${i + 1}`,
// //     month: "Apr",
// //     isCurrentWeek: i === 1,
// //   }));
// // }

// // export function HeatmapScheduler() {
// //   const [zoomLevel, setZoomLevel] = useState(1);
// //   const [excludeAllocations, setExcludeAllocations] = useState(false);
// //   const [heatmapMetric, setHeatmapMetric] = useState("percentage");

// //   const month = 4;
// //   const year = 2026;

// //   const weeks = generateWeeks(4);
// //   const cellWidth = 70 * zoomLevel;

// //   const { employees, allocations, loading } = useHeatmapData(month, year);

// //   const handleZoomIn = () => setZoomLevel(z => Math.min(z + 0.2, 2));
// //   const handleZoomOut = () => setZoomLevel(z => Math.max(z - 0.2, 0.6));

// //   if (loading) {
// //     return <div className="p-6 text-gray-500">Loading heatmap...</div>;
// //   }

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       <EmployeeSidebar departments={[]} />

// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         {/* Header */}
// //         <div className="bg-white border-b p-4 space-y-4">
// //           <div className="flex justify-between">
// //             <div>
// //               <h1 className="text-2xl font-semibold">Resource Heatmap Scheduler</h1>
// //               <p className="text-sm text-gray-600">Real-time monthly utilization</p>
// //             </div>

// //             <div className="flex gap-3">
// //               <Select value={heatmapMetric} onValueChange={setHeatmapMetric}>
// //                 <SelectTrigger className="w-48">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="percentage">Heat map in %</SelectItem>
// //                   <SelectItem value="hours">Heat map in hours</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //               <Button variant="outline" size="sm">
// //                 <Calendar className="h-4 w-4 mr-2" />
// //                 Today
// //               </Button>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-6">
// //             <Button size="sm" variant="outline" onClick={handleZoomOut}>
// //               <ZoomOut className="h-4 w-4" />
// //             </Button>
// //             <Button size="sm" variant="outline" onClick={handleZoomIn}>
// //               <ZoomIn className="h-4 w-4" />
// //             </Button>

// //             <Switch
// //               checked={excludeAllocations}
// //               onCheckedChange={setExcludeAllocations}
// //             />
// //             <Label>Exclude allocations</Label>

// //             <span className="ml-auto font-medium text-sm">
// //               April 2026
// //             </span>
// //           </div>
// //         </div>

// //         {/* Grid */}
// //         <div className="flex-1 overflow-auto bg-white">
// //           <div className="sticky top-0 flex border-b bg-gray-50 z-10">
// //             <div className="w-64 p-3 font-medium border-r">Employee</div>
// //             {weeks.map(w => (
// //               <div key={w.index} className="text-center border-r p-3" style={{ width: cellWidth }}>
// //                 {w.label}
// //               </div>
// //             ))}
// //           </div>

// //           {employees.map(emp => {
// //             const weekly = mapAllocationsToWeeks(allocations, emp._id, weeks);

// //             return (
// //               <div key={emp._id} className="flex border-b hover:bg-gray-50">
// //                 <div className="w-64 border-r p-3 flex gap-3 items-center">
// //                   <Avatar>
// //                     <AvatarFallback>
// //                       {emp.name.charAt(0)}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <div>
// //                     <div className="font-medium">{emp.name}</div>
// //                     <div className="text-xs text-gray-500">{emp.role}</div>
// //                   </div>
// //                 </div>

// //                 {weekly.map((cell, i) => {
// //                   if (excludeAllocations || cell.percentage === 0) {
// //                     return (
// //                       <div key={i} className="border-r p-2" style={{ width: cellWidth }} />
// //                     );
// //                   }

// //                   return (
// //                     <div
// //                       key={i}
// //                       className="border-r p-2 flex items-center justify-center"
// //                       style={{ width: cellWidth }}
// //                     >
// //                       <AllocationCell
// //                         percentage={
// //                           heatmapMetric === "percentage"
// //                             ? cell.percentage
// //                             : Math.round((cell.hours / 40) * 100)
// //                         }
// //                         hours={cell.hours}
// //                         projectName={cell.projectName}
// //                         showTooltip
// //                         size={zoomLevel > 1.2 ? "lg" : "md"}
// //                       />
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { EmployeeSidebar } from "../components/EmpSidebar";
// import { useResourceHeatmapData } from "../../hooks/useHeatMapData";
// import { buildDepartments } from "../../utils/buildDepts";
// import { mapAllocationsToMonths } from "../../utils/mapAlloctoMonths";

// /* ---------------- UTIL ---------------- */
// const MONTHS = [
//   { month: 1, label: "Jan" },
//   { month: 2, label: "Feb" },
//   { month: 3, label: "Mar" },
//   { month: 4, label: "Apr" },
//   { month: 5, label: "May" },
//   { month: 6, label: "Jun" },
//   { month: 7, label: "Jul" },
//   { month: 8, label: "Aug" },
//   { month: 9, label: "Sep" },
//   { month: 10, label: "Oct" },
//   { month: 11, label: "Nov" },
//   { month: 12, label: "Dec" },
// ];

// export function HeatmapScheduler() {
//   const [year] = useState(2026);

//   // Fetch ALL data for the year (month handled in mapping)
//   const { employees, departments, allocations, loading } =
//     useResourceHeatmapData(0, year);

//   const sidebarDepartments = buildDepartments(departments, employees);

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading resources…</div>;
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* LEFT SIDEBAR */}
//       <EmployeeSidebar departments={sidebarDepartments} />

//       {/* MAIN GRID */}
//       <div className="flex-1 overflow-auto bg-white">
//         {/* HEADER */}
//         <div className="sticky top-0 flex border-b bg-gray-50 z-10">
//           <div className="w-64 p-3 font-semibold border-r">
//             Employee
//           </div>

//           {MONTHS.map((m) => (
//             <div
//               key={m.month}
//               className="w-40 p-3 text-center border-r"
//             >
//               <div className="font-semibold">{m.label}</div>
//               <div className="text-xs text-gray-500">FTE / Billable</div>
//             </div>
//           ))}
//         </div>

//         {/* ROWS */}
//         {employees.map((emp) => {
//           const monthlyData = mapAllocationsToMonths(
//             allocations,
//             emp,
//             MONTHS
//           );

//           return (
//             <div
//               key={emp._id}
//               className="flex border-b hover:bg-gray-50"
//             >
//               {/* EMPLOYEE CELL */}
//               <div className="w-64 p-3 border-r">
//                 <div className="font-medium">{emp.name}</div>
//                 <div className="text-xs text-gray-500">
//                   {emp.departmentId?.name}
//                 </div>
//               </div>

//               {/* MONTH CELLS */}
//               {monthlyData.map((cell, idx) => (
//                 <div
//                   key={idx}
//                   className="w-40 border-r p-3 text-center"
//                 >
//                   {cell.hours > 0 ? (
//                     <>
//                       <div className="text-sm font-medium">
//                         {cell.hours}h
//                       </div>
//                       <div className="text-xs text-green-600">
//                         ₹{cell.billableAmount.toLocaleString()}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-xs text-gray-300">—</div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
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

  const { employees, departments, allocations, loading } =
    useResourceHeatmapData(0, year);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading resources…</div>;
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