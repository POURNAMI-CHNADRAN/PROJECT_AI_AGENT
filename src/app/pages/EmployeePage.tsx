import { useMemo, useState } from "react";
import {
  Plus,
  Clock,
  DollarSign,
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";

import { useResourceData } from "../../hooks/useResourceData";
import { useAnalytics } from "../../hooks/useAnalytics";
import { CreateEmployeeModal } from "../components/Employees";
import { KpiCard } from "../components/KPICard";
import { cn } from "../components/ui/utils";

export default function EmployeesPage() {
  const { employees, departments, projects, loading, refetchEmployees } = useResourceData(0, 0);
  const { utilization, bench, revenue } = useAnalytics(0, 0);
  const [showCreate, setShowCreate] = useState(false);

  /* ================= CALCULATIONS ================= */
  const metrics = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.status === "Active").length,
    inactive: employees.filter((e) => e.status === "Inactive").length,
    departments: departments.length,
    projects: projects.length,
  }), [employees, departments, projects]);

  const avgUtilization = utilization.length > 0
    ? Math.round(utilization.reduce((sum: number, u: any) => sum + (u.utilization || 0), 0) / utilization.length)
    : 0;

  const totalBench = bench.reduce((sum: number, b: any) => sum + (b.benchHours || 0), 0);
  const totalRevenue = revenue.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0);
  const totalAvailableHours = utilization.length * 160;

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-100 border-t-sky-500" />
        <p className="text-[10px] font-bold text-zinc-400 tracking-widest">LOADING ECOSYSTEM</p>
      </div>
    </div>
  );

  return (
    // Max-height set to 100vh minus typical navbar height to prevent page scroll
    <div className="h-full max-w-[1600px] mx-auto space-y-5 p-2 font-sans antialiased text-zinc-900 overflow-hidden">
      
      {/* ================= HEADER (Compact) ================= */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">
            Workforce <span className="text-sky-600">Intelligence</span>
          </h2>
          <p className="text-xs font-medium text-zinc-500">Real-time resource distribution & performance.</p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 active:scale-95 transition-all shadow-md"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* ================= TOP METRICS (Ultra Compact) ================= */}
      <div className="grid grid-cols-5 gap-4">
        <MetricTile icon={<Users size={16} />} label="Total" value={metrics.total} color="zinc" />
        <MetricTile icon={<UserCheck size={16} />} label="Active" value={metrics.active} color="emerald" />
        <MetricTile icon={<UserX size={16} />} label="Inactive" value={metrics.inactive} color="rose" />
        <MetricTile icon={<Building2 size={16} />} label="Depts" value={metrics.departments} color="blue" />
        <MetricTile icon={<Briefcase size={16} />} label="Projects" value={metrics.projects} color="amber" />
      </div>

      {/* ================= KPI SECTION ================= */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Total Capacity"
          value={totalAvailableHours.toLocaleString()}
          subtext="Monthly available"
          icon={<Clock size={20} className="text-blue-600" />}
          variant="blue"
        />
        <KpiCard
          label="Bench Strength"
          value={`${totalBench}h`}
          subtext={`${bench.length} on bench`}
          icon={<Users size={20} className="text-orange-600" />}
          variant="orange"
        />
        <KpiCard
          label="Revenue Projection"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          subtext="Monthly Forecast"
          icon={<DollarSign size={20} className="text-emerald-600" />}
          variant="emerald"
        />
        <KpiCard
          label="Utilization"
          value={`${avgUtilization}%`}
          subtext={avgUtilization > 75 ? "Optimal Range" : "Warning: Low"}
          icon={<TrendingUp size={20} className="text-purple-600" />}
          variant="purple"
        />
      </div>

      {/* ================= MODAL ================= */}
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

/* ================= COMPACT METRIC TILE ================= */
function MetricTile({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    zinc: "bg-zinc-100 text-zinc-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-white shadow-sm">
      <div className={cn("p-2 rounded-lg", colors[color])}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase text-zinc-400 leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-zinc-900 leading-none">{value}</p>
      </div>
    </div>
  );
}