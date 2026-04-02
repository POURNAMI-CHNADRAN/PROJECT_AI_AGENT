// import { useState } from "react";
// import { Clock, DollarSign, Users, TrendingUp } from "lucide-react";

// import { useResourceData } from "../../hooks/useResourceData";
// import EmployeeDrawer from "./EmployeeProfile";
// import { KpiCard } from "../components/KPICard";
// import { ResourcePlanningGrid } from "../components/PlannerGrid";

// export function PortfolioDashboard() {
//   const { employees, revenues } = useResourceData(3, 2026);
//   const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

//   /* ================= METRICS ================= */
//   const totalAllocated = employees.reduce(
//     (s, e) => s + (e.totalFTE || 0),
//     0
//   );
//   const totalAvailable = employees.length * 160;
//   const revenue = revenues.reduce(
//     (s, r) => s + (r.total_revenue || 0),
//     0
//   );
//   const utilization =
//     totalAvailable > 0
//       ? Math.round((totalAllocated / totalAvailable) * 100)
//       : 0;

//   return (
//     <div className="space-y-6">

//       {/* ================= HEADER ================= */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">
//           Portfolio Dashboard
//         </h1>

//         <div className="flex gap-2">
//           <input
//             placeholder="Search employee..."
//             className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
//           />
//           <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm">
//             + Allocate
//           </button>
//         </div>
//       </div>

//       {/* ================= KPI CARDS ================= */}
//       <div className="grid grid-cols-4 gap-4">
//         <KpiCard
//           label="Available Hours"
//           value={totalAvailable}
//           icon={<Clock />}
//         />
//         <KpiCard
//           label="Allocated Hours"
//           value={totalAllocated}
//           icon={<Users />}
//         />
//         <KpiCard
//           label="Revenue"
//           value={`₹${revenue}`}
//           icon={<DollarSign />}
//           trend="+12%"
//         />
//         <KpiCard
//           label="Utilization"
//           value={`${utilization}%`}
//           icon={<TrendingUp />}
//         />
//       </div>

//       {/* ================= RESOURCE PLANNING GRID ================= */}
//       <ResourcePlanningGrid
//         employees={employees}
//         onSelectEmployee={setSelectedEmployee}
//       />

//       {/* ================= EMPLOYEE DRAWER ================= */}
//       {selectedEmployee && (
//         <EmployeeDrawer
//           employee={selectedEmployee}
//           onClose={() => setSelectedEmployee(null)}
//         />
//       )}
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import { Clock, DollarSign, Users, TrendingUp, Plus } from "lucide-react";

import { useResourceData } from "../../hooks/useResourceData";
import EmployeeDrawer from "../components/EmployeeDrawer";
import { KpiCard } from "../components/KPICard";
import { ResourcePlanningGrid } from "../components/PlannerGrid";
import { AllocateModal } from "../components/AllocateModal";

export function PortfolioDashboard() {
  const {
    employees,
    projects,
    revenues,
    refetch,
  } = useResourceData(3, 2026);

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [showAllocate, setShowAllocate] = useState(false);

  /* ================= METRICS ================= */
  const totalAllocated = employees.reduce(
    (s, e) => s + (e.totalFTE || 0),
    0
  );
  const totalAvailable = employees.length * 160;

  const revenue = revenues.reduce(
    (s, r) => s + (r.total_revenue || 0),
    0
  );

  const utilization =
    totalAvailable > 0
      ? Math.round((totalAllocated / totalAvailable) * 100)
      : 0;

  /* ================= SEARCH ================= */
  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();

    return employees.filter((e) => {
      const nameMatch = e.name?.toLowerCase().includes(q);
      const idMatch = e.employeeId?.toLowerCase().includes(q);
      const skillMatch = (e.skills || []).some((s: any) =>
        (typeof s === "string" ? s : s.name)
          ?.toLowerCase()
          .includes(q)
      );
      return nameMatch || idMatch || skillMatch;
    });
  }, [employees, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Portfolio Dashboard</h1>
          <p className="text-sm text-gray-500">
            Resource utilization & planning
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, ID, Skill…"
            className="border rounded-lg px-3 py-2 text-sm
              focus:ring-2 focus:ring-sky-400 min-w-[260px]"
          />

          <button
            onClick={() => setShowAllocate(true)}
            className="flex items-center gap-2
              bg-sky-600 hover:bg-sky-700
              text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} />
            Allocate
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Available Hours" value={totalAvailable} icon={<Clock />} />
        <KpiCard label="Allocated Hours" value={totalAllocated} icon={<Users />} />
        <KpiCard label="Revenue" value={`₹${revenue}`} icon={<DollarSign />} />
        <KpiCard label="Utilization" value={`${utilization}%`} icon={<TrendingUp />} />
      </div>

      {/* GRID */}
      <ResourcePlanningGrid
        employees={filteredEmployees}
        onSelectEmployee={setSelectedEmployee}
      />

      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* ALLOCATE MODAL */}
      {showAllocate && (
        <AllocateModal
          employees={employees}
          projects={projects}
          onClose={() => setShowAllocate(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}