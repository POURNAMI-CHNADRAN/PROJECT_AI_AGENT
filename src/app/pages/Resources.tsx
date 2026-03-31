// import { useEffect, useState } from "react";
// import { ChevronDown, ChevronRight, ArrowLeftRight, Users} from "lucide-react";
// import EmployeeDetails from "../components/EmployeeDetails";

// /* ================= CONFIG ================= */
// const WEEKLY_CAPACITY = 40;
// const MONTHLY_CAPACITY = 160;

// const monthLabel = "March 2026";
// const weeks = ["W1", "W2", "W3", "W4", "W5"];

// /* ================= HELPERS ================= */
// function getUtilizationColor(hrs: number) {
//   if (hrs === 0) return "bg-gray-100 text-gray-600";
//   if (hrs < WEEKLY_CAPACITY) return "bg-yellow-200 text-yellow-800";
//   if (hrs === WEEKLY_CAPACITY) return "bg-green-300 text-green-900";
//   return "bg-red-300 text-red-900";
// }

// /* Auto spread monthly → weekly */
// function distributeMonthly(hours: number, weeksCount: number) {
//   const base = Math.floor(hours / weeksCount);
//   const remainder = hours % weeksCount;

//   return Array.from({ length: weeksCount }).map((_, i) =>
//     i < remainder ? base + 1 : base
//   );
// }

// /* ================= COMPONENT ================= */
// export default function ResourcePlanner() {
//   const API = import.meta.env.VITE_API_BASE_URL;
//   const token = localStorage.getItem("token");

//   const [people, setPeople] = useState<any[]>([]);
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);


//   useEffect(() => {
//     fetch(`${API}/api/employees`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => r.json())
//       .then(setPeople);
//   }, []);

//   return (
//     <div className="p-6 bg-slate-50 space-y-4">

//       {/* Title */}
//       <div className="bg-sky-200 p-7 rounded-xl shadow text-sky-900 flex justify-between items-center animate-fade-in">
//         <div className="flex items-center gap-4">
//           <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow border border-sky-100">
//             <Users size={28} className="text-sky-700" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-semibold">Resource Management</h1>
//             <p className="text-sky-700 text-sm">
//                Track allocation, FTE & billing health
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Month Header */}
//       <div className="bg-white px-4 py-3 rounded-xl shadow flex justify-between items-center">
//         <div className="font-semibold">{monthLabel}</div>
//         <div className="text-sm text-gray-500">
//           Weekly capacity: {WEEKLY_CAPACITY}h · Monthly: {MONTHLY_CAPACITY}h
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm border-collapse">

//           {/* HEADER */}
//           <thead className="bg-slate-100">
//             <tr>
//               <th className="p-3 text-left w-[300px]">People / Projects</th>
//               {weeks.map(w => (
//                 <th key={w} className="text-center">{w}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {people.map(person => {
//               const isOpen = expanded[person._id];

//               const monthlyHours = person.totalFTE || 0;
//               const weeklySplit = distributeMonthly(monthlyHours, weeks.length);

//               return (
//                 <>
//                   {/* PERSON ROW */}
//                   <tr key={person._id} className="border-t hover:bg-slate-50">

//                     {/* Left */}
//                     <td className="p-3">
//                     <div
//                       className="flex items-center gap-2 cursor-pointer"
//                       onClick={() => setSelectedEmployee(person)}
//                     >
//                         {isOpen
//                           ? <ChevronDown size={16} />
//                           : <ChevronRight size={16} />
//                         }

//                         <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
//                           {person.name[0]}
//                         </div>

//                         <div>
//                           <div className="font-semibold">{person.name}</div>
//                           <div className="text-xs text-gray-500">
//                             {monthlyHours}h / month
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Weeks */}
//                     {weeklySplit.map((hrs, i) => {
//                       const canMove = hrs <= WEEKLY_CAPACITY;

//                       return (
//                         <td key={i} className="p-2 text-center">

//                           {/* Auto-calculated cell */}
//                           <div
//                             className={`rounded h-9 flex items-center justify-center text-xs font-semibold ${getUtilizationColor(hrs)}`}
//                           >
//                             {hrs === 0 ? "Free" : `${hrs}h`}
//                           </div>

//                           {/* Move */}
//                           <button
//                             disabled={!canMove}
//                             title={
//                               canMove
//                                 ? "Eligible to move"
//                                 : "Over weekly capacity"
//                             }
//                             className={`mt-1 ${
//                               canMove
//                                 ? "text-indigo-600 hover:text-indigo-800"
//                                 : "text-gray-300 cursor-not-allowed"
//                             }`}
//                           >
//                             <ArrowLeftRight size={14} />
//                           </button>

//                         </td>
//                       );
//                     })}
//                   </tr>

//                   {/* PROJECT HISTORY */}
//                   {isOpen && person.allocations?.map((a: any) => (
//                     <tr key={a._id} className="bg-gray-50">

//                       <td className="pl-12 py-2 text-xs text-gray-700">
//                         ▸ {a.project.name}
//                         <span className={`ml-2 px-2 py-0.5 rounded text-xs
//                           ${a.isBillable
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"}`}
//                         >
//                           {a.isBillable ? "Billable" : "Non‑Billable"}
//                         </span>
//                       </td>

//                       {weeks.map((_, i) => (
//                         <td key={i} className="text-center text-xs">
//                           —
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </>
//               );
//             })}
//           </tbody>

//         </table>
//       </div>

//         {selectedEmployee && (
//         <EmployeeDetails
//           employee={selectedEmployee}
//           onClose={() => setSelectedEmployee(null)}
//         />
//       )}
//     </div>
//   );
// }



// // import { useEffect, useState } from "react";
// // import { ChevronDown, ChevronRight, ArrowLeftRight, Users} from "lucide-react";
// // import EmployeeDetails from "../components/EmployeeDetails";

// // /* ================= CONFIG ================= */
// // const WEEKLY_CAPACITY = 40;
// // const MONTHLY_CAPACITY = 160;

// // const monthLabel = "March 2026";
// // const weeks = ["W1", "W2", "W3", "W4", "W5"];

// // /* ================= HELPERS ================= */
// // function getUtilizationColor(hrs: number) {
// //   if (hrs === 0) return "bg-gray-100 text-gray-600";
// //   if (hrs < WEEKLY_CAPACITY) return "bg-yellow-200 text-yellow-800";
// //   if (hrs === WEEKLY_CAPACITY) return "bg-green-300 text-green-900";
// //   return "bg-red-300 text-red-900";
// // }

// // /* Auto spread monthly → weekly */
// // function distributeMonthly(hours: number, weeksCount: number) {
// //   const base = Math.floor(hours / weeksCount);
// //   const remainder = hours % weeksCount;

// //   return Array.from({ length: weeksCount }).map((_, i) =>
// //     i < remainder ? base + 1 : base
// //   );
// // }

// // /* ================= COMPONENT ================= */
// // export default function ResourcePlanner() {
// //   const API = import.meta.env.VITE_API_BASE_URL;
// //   const token = localStorage.getItem("token");

// //   const [people, setPeople] = useState<any[]>([]);
// //   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

// //   const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);


// //   useEffect(() => {
// //     fetch(`${API}/api/employees`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     })
// //       .then(r => r.json())
// //       .then(setPeople);
// //   }, []);

// //   return (
// //     <div className="p-6 bg-slate-50 space-y-4">

// //       {/* Title */}
// //       <div className="bg-sky-200 p-7 rounded-xl shadow text-sky-900 flex justify-between items-center animate-fade-in">
// //         <div className="flex items-center gap-4">
// //           <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow border border-sky-100">
// //             <Users size={28} className="text-sky-700" />
// //           </div>
// //           <div>
// //             <h1 className="text-3xl font-semibold">Resource Management</h1>
// //             <p className="text-sky-700 text-sm">
// //                Track allocation, FTE & billing health
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Month Header */}
// //       <div className="bg-white px-4 py-3 rounded-xl shadow flex justify-between items-center">
// //         <div className="font-semibold">{monthLabel}</div>
// //         <div className="text-sm text-gray-500">
// //           Weekly capacity: {WEEKLY_CAPACITY}h · Monthly: {MONTHLY_CAPACITY}h
// //         </div>
// //       </div>

// //       {/* Grid */}
// //       <div className="bg-white rounded-xl shadow overflow-x-auto">
// //         <table className="w-full text-sm border-collapse">

// //           {/* HEADER */}
// //           <thead className="bg-slate-100">
// //             <tr>
// //               <th className="p-3 text-left w-[300px]">People / Projects</th>
// //               {weeks.map(w => (
// //                 <th key={w} className="text-center">{w}</th>
// //               ))}
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {people.map(person => {
// //               const isOpen = expanded[person._id];

// //               const monthlyHours = person.totalFTE || 0;
// //               const weeklySplit = distributeMonthly(monthlyHours, weeks.length);

// //               return (
// //                 <>
// //                   {/* PERSON ROW */}
// //                   <tr key={person._id} className="border-t hover:bg-slate-50">

// //                     {/* Left */}
// //                     <td className="p-3">
// //                     <div
// //                       className="flex items-center gap-2 cursor-pointer"
// //                       onClick={() => setSelectedEmployee(person)}
// //                     >
// //                         {isOpen
// //                           ? <ChevronDown size={16} />
// //                           : <ChevronRight size={16} />
// //                         }

// //                         <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
// //                           {person.name[0]}
// //                         </div>

// //                         <div>
// //                           <div className="font-semibold">{person.name}</div>
// //                           <div className="text-xs text-gray-500">
// //                             {monthlyHours}h / month
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </td>

// //                     {/* Weeks */}
// //                     {weeklySplit.map((hrs, i) => {
// //                       const canMove = hrs <= WEEKLY_CAPACITY;

// //                       return (
// //                         <td key={i} className="p-2 text-center">

// //                           {/* Auto-calculated cell */}
// //                           <div
// //                             className={`rounded h-9 flex items-center justify-center text-xs font-semibold ${getUtilizationColor(hrs)}`}
// //                           >
// //                             {hrs === 0 ? "Free" : `${hrs}h`}
// //                           </div>

// //                           {/* Move */}
// //                           <button
// //                             disabled={!canMove}
// //                             title={
// //                               canMove
// //                                 ? "Eligible to move"
// //                                 : "Over weekly capacity"
// //                             }
// //                             className={`mt-1 ${
// //                               canMove
// //                                 ? "text-indigo-600 hover:text-indigo-800"
// //                                 : "text-gray-300 cursor-not-allowed"
// //                             }`}
// //                           >
// //                             <ArrowLeftRight size={14} />
// //                           </button>

// //                         </td>
// //                       );
// //                     })}
// //                   </tr>

// //                   {/* PROJECT HISTORY */}
// //                   {isOpen && person.allocations?.map((a: any) => (
// //                     <tr key={a._id} className="bg-gray-50">

// //                       <td className="pl-12 py-2 text-xs text-gray-700">
// //                         ▸ {a.project.name}
// //                         <span className={`ml-2 px-2 py-0.5 rounded text-xs
// //                           ${a.isBillable
// //                             ? "bg-green-100 text-green-700"
// //                             : "bg-blue-100 text-blue-700"}`}
// //                         >
// //                           {a.isBillable ? "Billable" : "Non‑Billable"}
// //                         </span>
// //                       </td>

// //                       {weeks.map((_, i) => (
// //                         <td key={i} className="text-center text-xs">
// //                           —
// //                         </td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </>
// //               );
// //             })}
// //           </tbody>

// //         </table>
// //       </div>

// //         {selectedEmployee && (
// //         <EmployeeDetails
// //           employee={selectedEmployee}
// //           onClose={() => setSelectedEmployee(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { Users } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

// import { ResourcePlanningGrid } from "../components/PlannerGrid";
// import EmployeeDetails from "../components/EmployeeDetails";
// import { PortfolioDashboard } from "./PortfolioDashboard";
// import { HeatmapScheduler } from "./HeatmapScheduler";
// import { WorkloadManager } from "./WorkloadManager";
// import { useResourceData } from "../../hooks/useResourceData";

// export default function ResourcePlanner() {
//   const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
//   const { employees, loading } = useResourceData(3, 2026);

//   if (loading) return <div className="p-6">Loading…</div>;

//   return (
//     <div className="p-6 bg-slate-50 space-y-6">
//       <div className="bg-sky-200 p-6 rounded-xl flex gap-4">
//         <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center">
//           <Users className="text-sky-700" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-semibold">Resource Management</h1>
//           <p className="text-sm text-sky-700">Planning • Utilization • Revenue</p>
//         </div>
//       </div>

//       <Tabs defaultValue="planner">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="planner">Planner</TabsTrigger>
//           <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
//           <TabsTrigger value="workload">Workload</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <PortfolioDashboard />
//         </TabsContent>

//         <TabsContent value="planner">
//           <ResourcePlanningGrid people={employees} setSelectedEmployee={setSelectedEmployee} />
//         </TabsContent>

//         <TabsContent value="heatmap">
//           <HeatmapScheduler />
//         </TabsContent>

//         <TabsContent value="workload">
//           <WorkloadManager />
//         </TabsContent>
//       </Tabs>

//       {selectedEmployee && (
//         <EmployeeDetails employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
//       )}
//     </div>
//   );
// }

export default function Resources() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Resources</h1>
    </div>
  );
}