import { useMemo, useState } from "react";
import { Plus, Users, Building2, Briefcase, TrendingUp, UserCheck, UserX } from "lucide-react";
import { useResourceData } from "../../hooks/useResourceData";
import { CreateEmployeeModal } from "../components/Employees";
import { cn } from "../components/ui/utils";

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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-sky-100 border-t-sky-500" />
          <p className="text-sm font-semibold text-zinc-400 tracking-wide">REFRESHING DATA...</p>
        </div>
      </div>
    );
  }

  return (
    /* Using standard system sans-serif stack */
    <div className="max-w-[1600px] mx-auto space-y-10 font-sans antialiased text-zinc-900">
      
      {/* ================= SECTION HEADER ================= */}
      <div className="flex items-center justify-between border-b border-sky-50 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Workforce <span className="text-sky-600">Overview</span>
          </h2>
          <p className="text-base font-medium text-zinc-500">
            Monitor headcount, departmental growth, and project distribution.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="group relative flex items-center gap-2 overflow-hidden px-6 py-3 bg-sky-600 text-white text-sm font-bold rounded-xl transition-all hover:bg-sky-700 active:scale-95 shadow-lg shadow-sky-200"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* ================= METRICS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard 
          icon={<Users size={22} />} 
          label="Total Headcount" 
          value={metrics.total} 
          variant="sky" 
        />
        <MetricCard 
          icon={<UserCheck size={22} />} 
          label="Active Talent" 
          value={metrics.active} 
          variant="emerald" 
        />
        <MetricCard 
          icon={<UserX size={22} />} 
          label="Inactive" 
          value={metrics.inactive} 
          variant="rose" 
        />
        <MetricCard 
          icon={<Building2 size={22} />} 
          label="Departments" 
          value={metrics.departments} 
          variant="indigo" 
        />
        <MetricCard 
          icon={<Briefcase size={22} />} 
          label="Active Projects" 
          value={metrics.projects} 
          variant="amber" 
        />
      </div>

      {/* MODAL */}
      {showCreate && (
        <CreateEmployeeModal
          departments={departments}
          onClose={() => setShowCreate(false)}
          onSuccess={async () => {
            await refetchEmployees();
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

// ================= PREMIUM METRIC CARD =================
function MetricCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant: "sky" | "emerald" | "indigo" | "amber" | "rose";
}) {
  const styles = {
    sky: "bg-sky-50 text-sky-600 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
  };

  return (
    <div className="group relative p-6 rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:border-sky-200 hover:shadow-[0_20px_40px_-15px_rgba(0,163,255,0.1)]">
      <div className="flex flex-col gap-5">
        {/* Icon Container */}
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset shadow-sm transition-transform group-hover:scale-110",
          styles[variant]
        )}>
          {icon}
        </div>
        
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            {label}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold tracking-tighter text-zinc-900">
              {value.toLocaleString()}
            </span>
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-50">
                <TrendingUp size={12} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}