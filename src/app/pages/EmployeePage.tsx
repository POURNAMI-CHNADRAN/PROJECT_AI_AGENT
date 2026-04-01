import { useState } from "react";
import { Plus, Users, Building2, Briefcase, AlertTriangle } from "lucide-react";
import { useResourceData } from "../../hooks/useResourceData";
import { CreateEmployeeModal } from "../components/Employees";

export default function EmployeesPage() {
  const {
    employees,
    departments,
    projects,
    loading,
    refetch,
  } = useResourceData(0, 0);

  const [showCreate, setShowCreate] = useState(false);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading resources…</div>;
  }

  /* ================= METRICS (REAL DATA) ================= */
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e: any) => e.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (e: any) => e.status === "Inactive"
  ).length;

  const billableEmployees = employees.filter((e: any) =>
    e.allocations?.some((a: any) => a.isBillable)
  ).length;

  const overbilledEmployees = employees.filter(
    (e: any) => e.utilizationStatus === "Overbilled"
  ).length;

  const totalDepartments = departments.length;
  const totalProjects = projects.length;

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Organization Overview</h2>
          <p className="text-sm text-gray-500">
            Organization-wide workforce summary
          </p>
        </div>

        {/* ✅ ADD EMPLOYEE */}
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* ===== METRIC CARDS ===== */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Employees */}
        <MetricCard
          icon={<Users size={22} />}
          label="Total Employees"
          value={totalEmployees}
          color="sky"
        />

        {/* Active Employees */}
        <MetricCard
          icon={<Users size={22} />}
          label="Active Employees"
          value={activeEmployees}
          color="emerald"
        />

        {/* Inactive Employees */}
        <MetricCard
          icon={<Users size={22} />}
          label="Inactive Employees"
          value={inactiveEmployees}
          color="gray"
        />

        {/* Departments */}
        <MetricCard
          icon={<Building2 size={22} />}
          label="Departments"
          value={totalDepartments}
          color="indigo"
        />

        {/* Projects */}
        <MetricCard
          icon={<Briefcase size={22} />}
          label="Projects"
          value={totalProjects}
          color="amber"
        />

        {/* Overbilled */}
        <MetricCard
          icon={<AlertTriangle size={22} />}
          label="Overbilled Employees"
          value={overbilledEmployees}
          color="red"
        />
      </div>

      {/* ===== CREATE EMPLOYEE MODAL ===== */}
      {showCreate && (
        <CreateEmployeeModal
          departments={departments}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            refetch();      // ✅ refresh employees + metrics
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

/* ================= METRIC CARD ================= */

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "sky" | "emerald" | "indigo" | "amber" | "red" | "gray";
}) {
  const colors: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-5 rounded-xl border bg-white flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}