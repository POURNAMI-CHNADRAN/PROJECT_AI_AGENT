import { useMemo, useState } from "react";
import { Clock, DollarSign, Users, TrendingUp, Plus } from "lucide-react";

import { useResourceData } from "../../hooks/useResourceData";
import EmployeeDrawer from "../components/EmployeeDrawer";
import { KpiCard } from "../components/KPICard";
import { ResourcePlanningGrid } from "../components/PlannerGrid";
import { AllocateModal } from "../components/AllocateModal";
import { canEditEmployee } from "../../utils/auth";

/* ================= CONSTANTS ================= */

// Always show all months
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Dynamic years: past + future
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2020;     // adjust if needed
const FUTURE_YEARS = 5;

const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 + FUTURE_YEARS },
  (_, i) => START_YEAR + i
);

export function PortfolioDashboard() {

  /* ================= DATE SELECTION ================= */

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  /* ================= DATA ================= */

  const {
    employees,
    projects,
    workCategories,
    revenues,
    refetchEmployees,
  } = useResourceData(selectedMonth, selectedYear);

  /* ================= UI STATE ================= */

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [showAllocate, setShowAllocate] = useState(false);

  const canEdit = canEditEmployee();

  /* ================= METRICS ================= */

  const {
    totalAvailableHours,
    totalAllocatedHours,
    utilization,
    revenue,
  } = useMemo(() => {
    const HOURS_PER_EMPLOYEE = 160;

    const totalAvailable = employees.length * HOURS_PER_EMPLOYEE;

    const totalAllocated = employees.reduce((sum, e) => {
      if (!Array.isArray(e.allocations)) return sum;
      return (
        sum +
        e.allocations.reduce(
          (s: number, a: any) => s + (a.allocatedHours || 0),
          0
        )
      );
    }, 0);

    const totalRevenue = revenues.reduce(
      (s, r) => s + (r.total_revenue || 0),
      0
    );

    const util =
      totalAvailable > 0
        ? Math.round((totalAllocated / totalAvailable) * 100)
        : 0;

    return {
      totalAvailableHours: totalAvailable,
      totalAllocatedHours: totalAllocated,
      utilization: util,
      revenue: totalRevenue,
    };
  }, [employees, revenues]);

  /* ================= SEARCH ================= */

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;

    const q = search.toLowerCase();

    return employees.filter((e) => {
      const nameMatch = e.name?.toLowerCase().includes(q);

      const codeMatch = e.employeeCode
        ?.toLowerCase()
        .includes(q);

      const skillMatch = (e.skills || []).some((s: any) =>
        (typeof s === "string" ? s : s.name)
          ?.toLowerCase()
          .includes(q)
      );

      return nameMatch || codeMatch || skillMatch;
    });
  }, [employees, search]);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Portfolio Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Viewing allocations for{" "}
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
        </div>

        <div className="flex gap-2 items-center">

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value))
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, EMP Code, Skill…"
            className="border rounded-lg px-3 py-2 text-sm
              focus:ring-2 focus:ring-sky-400 min-w-[260px]"
          />

          {/* Allocate */}
          {canEdit && (
            <button
              onClick={() => setShowAllocate(true)}
              className="flex items-center gap-2
                bg-sky-600 hover:bg-sky-700
                text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} />
              Allocate
            </button>
          )}
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Available Hours"
          value={totalAvailableHours}
          icon={<Clock />}
        />
        <KpiCard
          label="Allocated Hours"
          value={totalAllocatedHours}
          icon={<Users />}
        />
        <KpiCard
          label="Revenue"
          value={`₹${revenue.toLocaleString()}`}
          icon={<DollarSign />}
        />
        <KpiCard
          label="Utilization"
          value={`${utilization}%`}
          icon={<TrendingUp />}
        />
      </div>

      {/* ================= GRID ================= */}
      <ResourcePlanningGrid
        employees={filteredEmployees}
        onSelectEmployee={setSelectedEmployee}
      />

      {/* ================= EMPLOYEE DRAWER ================= */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          canEdit={canEdit}
          projects={projects}
          workCategories={workCategories}
          refetchEmployees={refetchEmployees}
        />
      )}

      {/* ================= ALLOCATE MODAL ================= */}
      {showAllocate && (
        <AllocateModal
          mode="create"
          employees={employees}
          projects={projects}
          workCategories={workCategories}
          onClose={() => setShowAllocate(false)}
          onSuccess={async () => {
            await refetchEmployees();
            setShowAllocate(false);
          }}
        />
      )}
    </div>
  );
}