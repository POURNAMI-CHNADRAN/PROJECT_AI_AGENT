import { useMemo, useState } from "react";
import { Plus, Users, Building2, Briefcase } from "lucide-react";
import { useResourceData } from "../../hooks/useResourceData";
import { CreateEmployeeModal } from "../components/Employees";

export default function EmployeesPage() {
  const {
    employees,
    departments,
    projects,
    loading,
    refetchEmployees,
  } = useResourceData(0, 0);

  const [showCreate, setShowCreate] = useState(false);

  const metrics = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === "Active").length,
      inactive: employees.filter(e => e.status === "Inactive").length,
      departments: departments.length,
      projects: projects.length,
    };
  }, [employees, departments, projects]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading resources…</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Organization Overview</h2>
          <p className="text-sm text-gray-500">
            Workforce Summary
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-6">
        <MetricCard icon={<Users />} label="Total Employees" value={metrics.total} color="sky" />
        <MetricCard icon={<Users />} label="Active Employees" value={metrics.active} color="emerald" />
        <MetricCard icon={<Users />} label="Inactive Employees" value={metrics.inactive} color="gray" />
        <MetricCard icon={<Building2 />} label="Departments" value={metrics.departments} color="indigo" />
        <MetricCard icon={<Briefcase />} label="Projects" value={metrics.projects} color="amber" />
      </div>

      {/* MODAL */}
      {showCreate && (
        <CreateEmployeeModal
          departments={departments}
          onClose={() => setShowCreate(false)}
          onSuccess={async () => {
            await refetchEmployees();   // ✅ instant update
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "sky" | "emerald" | "indigo" | "amber" | "gray";
}) {
  const colors: Record<string, string> = {
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-5 rounded-xl border bg-white flex gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}