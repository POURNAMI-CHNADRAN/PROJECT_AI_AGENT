import { useState } from "react";
import { Clock, DollarSign, Users, TrendingUp } from "lucide-react";

import { useResourceData } from "../../hooks/useResourceData";
import EmployeeDrawer from "./EmployeeProfile";
import { InsightBanner } from "../components/InsightBanner";
import { KpiCard } from "../components/KPICard";
import { ResourcePlanningGrid } from "../components/PlannerGrid";

export function PortfolioDashboard() {
  const { employees, revenues } = useResourceData(3, 2026);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

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

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Portfolio Dashboard
        </h1>

        <div className="flex gap-2">
          <input
            placeholder="Search employee..."
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm">
            + Allocate
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Available Hours"
          value={totalAvailable}
          icon={<Clock />}
        />
        <KpiCard
          label="Allocated Hours"
          value={totalAllocated}
          icon={<Users />}
        />
        <KpiCard
          label="Revenue"
          value={`₹${revenue}`}
          icon={<DollarSign />}
          trend="+12%"
        />
        <KpiCard
          label="Utilization"
          value={`${utilization}%`}
          icon={<TrendingUp />}
        />
      </div>

      {/* ================= INSIGHT ================= */}
      <InsightBanner message="3 employees are over‑utilized. Rebalance workload." />

      {/* ================= RESOURCE PLANNING GRID ================= */}
      <ResourcePlanningGrid
        employees={employees}
        onSelectEmployee={setSelectedEmployee}
      />

      {/* ================= EMPLOYEE DRAWER ================= */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}