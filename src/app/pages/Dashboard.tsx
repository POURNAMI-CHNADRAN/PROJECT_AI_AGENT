import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import EmployeeDrawer from "../components/EmployeeDrawer";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const today = new Date();

  /* ---------------- STATE ---------------- */
  const [month] = useState(today.getMonth() + 1);
  const [year] = useState(today.getFullYear());

  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

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

  const utilizationColor =
    avgUtilization >= 90 ? "emerald" : avgUtilization >= 70 ? "amber" : "red";

  /* ---------------- OPEN DRAWER ---------------- */
  const openEmployee = async (employeeId: string) => {
    try {
      setLoadingEmployee(true);

      const res = await axios.get(
        `${API}/api/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSelectedEmployee(res.data?.data);
    } catch (err) {
      console.error("Failed to load employee", err);
    } finally {
      setLoadingEmployee(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-8">

      {/* HEADER */}
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
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700
          text-white px-5 py-2.5 rounded-xl shadow"
        >
          View Allocations
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-6">
        <InsightCard title="Workforce" value={employeeCount} icon={<Users />} color="sky" />
        <InsightCard title="Utilization" value={`${avgUtilization}%`} icon={<TrendingUp />} color={utilizationColor} />
        <InsightCard title="Bench Hours" value={`${totalBenchHours} h`} icon={<AlertTriangle />} color={criticalBenchCount > 0 ? "amber" : "emerald"} />
        <InsightCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<Briefcase />} color="indigo" />
      </div>

      {/* PANELS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <SectionHeader title="Bench Overview" description="Employees with unused or risky capacity" />
          <BenchTable
            data={safeBench}
            onSelectEmployee={(employeeId) => openEmployee(employeeId)}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <SectionHeader title="Smart Suggestions" description="AI-driven allocation guidance" />
          <SuggestionPanel suggestions={suggestions} />
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {loadingEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-white">
          Loading employee…
        </div>
      )}

      {/* DRAWER */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          canEdit={true}
          projects={selectedEmployee.projects || []}
          workCategories={selectedEmployee.workCategories || []}
          refetchEmployees={() => {}}
        />
      )}
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function InsightCard({ title, value, icon, color }: any) {
  const map: any = {
    sky: "bg-sky-100 text-sky-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${map[color]}`}>{icon}</div>
    </div>
  );
}

function SectionHeader({ title, description }: any) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}