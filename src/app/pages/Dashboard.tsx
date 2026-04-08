import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "../../hooks/useAnalytics";

import {
  TrendingUp,
  Users,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import { BenchTable } from "../components/BenchTable";
import { SuggestionPanel } from "../components/SuggestionPanel";
import EmployeeDrawerID from "../components/EmployeeDrawerID";

/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const today = new Date();

  /* ---------------- STATE ---------------- */
  const [month] = useState(today.getMonth() + 1);
  const [year] = useState(today.getFullYear());
  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<string | null>(null);

  const navigate = useNavigate();

  /* ---------------- ANALYTICS ---------------- */
  const { loading, utilization, bench, revenue, suggestions } =
    useAnalytics(month, year);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 animate-pulse">
        Loading Resource Intelligence…
      </div>
    );
  }

  const safeUtilization = Array.isArray(utilization) ? utilization : [];
  const safeBench = Array.isArray(bench) ? bench : [];
  const safeRevenue = Array.isArray(revenue) ? revenue : [];

  /* ---------------- METRICS ---------------- */
  const employeeCount = safeUtilization.length;

  const avgUtilization =
    employeeCount > 0
      ? Math.round(
          safeUtilization.reduce(
            (s, u) => s + (u.utilization || u.billable_percent || 0),
            0
          ) / employeeCount
        )
      : 0;

  const totalBenchHours = safeBench.reduce(
    (s, b) => s + (b.benchHours || 0),
    0
  );

  const criticalBenchCount = safeBench.filter(
    (b) => b.risk === "HIGH"
  ).length;

  const totalRevenue = safeRevenue.reduce(
    (s, r) => s + (r.revenue || 0),
    0
  );

  /* ---------------- STATUS COLORS ---------------- */
  const utilizationColor =
    avgUtilization >= 90
      ? "emerald"
      : avgUtilization >= 70
      ? "amber"
      : "red";

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-8">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Resource Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            {month}/{year} · Workforce · Utilization · Bench
          </p>
        </div>

        <button
          onClick={() => navigate("/resources/portfolio")}
          className="flex items-center gap-2 rounded-xl
            bg-sky-600 hover:bg-sky-700
            text-white px-5 py-2.5 shadow-sm"
        >
          View Allocations <ArrowUpRight size={16} />
        </button>
      </div>

      {/* ---------------- KPI STRIP ---------------- */}
      <div className="grid grid-cols-4 gap-6">

        <InsightCard
          title="Total Workforce"
          value={employeeCount}
          subtitle="Active employees"
          icon={<Users />}
          color="sky"
        />

        <InsightCard
          title="Avg Utilization"
          value={`${avgUtilization}%`}
          subtitle={
            utilizationColor === "emerald"
              ? "Healthy utilization"
              : utilizationColor === "amber"
              ? "Watch closely"
              : "Critical under‑utilization"
          }
          icon={<TrendingUp />}
          color={utilizationColor}
        />

        <InsightCard
          title="Bench Hours"
          value={`${totalBenchHours} h`}
          subtitle={`${criticalBenchCount} high‑risk employees`}
          icon={<AlertTriangle />}
          color={criticalBenchCount > 0 ? "amber" : "emerald"}
        />

        <InsightCard
          title="Revenue Impact"
          value={`₹${totalRevenue.toLocaleString()}`}
          subtitle="Monthly billing"
          icon={<Briefcase />}
          color="indigo"
        />

      </div>

      {/* ---------------- MAIN PANELS ---------------- */}
      <div className="grid grid-cols-3 gap-6">

        {/* BENCH TABLE */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <SectionHeader
            title="Bench Overview"
            description="Employees with unused or at‑risk capacity"
          />
          <BenchTable
            data={safeBench}
            onSelectEmployee={setSelectedEmployeeId}
          />
        </div>

        {/* AI SUGGESTIONS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <SectionHeader
            title="Smart Suggestions"
            description="AI‑driven reallocation insights"
          />
          <SuggestionPanel suggestions={suggestions} />
        </div>
      </div>

      {/* ---------------- DRAWER ---------------- */}
      {selectedEmployeeId && (
        <EmployeeDrawerID
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}

      {/* ---------------- FOOTER ---------------- */}
      <div className="text-xs text-slate-500 text-right">
        Employees: {employeeCount} · Bench Records: {safeBench.length}
      </div>
    </div>
  );
}

/* ================= SUPPORT COMPONENTS ================= */

function InsightCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: "sky" | "emerald" | "amber" | "red" | "indigo";
}) {
  const colorMap: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}