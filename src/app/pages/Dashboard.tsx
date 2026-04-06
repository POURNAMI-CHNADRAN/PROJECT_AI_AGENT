import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:5000/api/reports";

/* ================= TYPES ================= */
type Utilization = {
  employee_id: string;
  billable_percent: number;
  non_billable_percent: number;
};

type RevenueByProject = {
  _id: string; // project name (confirmed by backend)
  revenue: number;
};

type BenchEmployee = {
  _id: string;
  employee_id: string;
  name: string;
};

type DashboardSummary = {
  totalRevenue: number;
  totalAllocations: number;
};

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const [utilization, setUtilization] = useState<Utilization[]>([]);
  const [revenueProjects, setRevenueProjects] = useState<RevenueByProject[]>([]);
  const [bench, setBench] = useState<BenchEmployee[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalRevenue: 0,
    totalAllocations: 0,
  });
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        summaryRes,
        utilRes,
        revenueRes,
        benchRes
      ] = await Promise.all([
        axios.get(`${API}/dashboard`),
        axios.get(`${API}/utilization`),
        axios.get(`${API}/revenue-project`),
        axios.get(`${API}/bench`)
      ]);

      setSummary(summaryRes.data || { totalRevenue: 0, totalAllocations: 0 });
      setUtilization(Array.isArray(utilRes.data) ? utilRes.data : []);
      setRevenueProjects(Array.isArray(revenueRes.data) ? revenueRes.data : []);

      const benchEmployees = Array.isArray(benchRes.data?.employees)
        ? benchRes.data.employees
        : [];

      setBench(benchEmployees);

    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= DERIVED METRICS ================= */
  const totalEmployees = utilization.length;

  const billableEmployees = utilization.filter(
    u => u.billable_percent > 0
  ).length;

  const nonBillableEmployees = totalEmployees - billableEmployees;

  const avgUtilization =
    utilization.length > 0
      ? Math.round(
          utilization.reduce((sum, u) => sum + u.billable_percent, 0) /
            utilization.length
        )
      : 0;

  /* ================= CHART DATA ================= */

  const billablePieData = [
    { name: "Billable", value: billableEmployees },
    { name: "Non‑Billable", value: nonBillableEmployees }
  ];

  const revenueTrendData = revenueProjects.map(p => ({
    name: p._id,
    revenue: p.revenue
  }));

  const benchForecastData = [
    {
      label: "Current Bench",
      count: bench.length
    }
  ];

  if (loading) {
    return <p className="p-6">Loading Dashboard...</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-sky-50 p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-sky-900">Dashboard</h1>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={totalEmployees} icon={<Users />} />
        <StatCard title="Billable Employees" value={billableEmployees} icon={<UserCheck />} />
        <StatCard title="Non‑Billable Employees" value={nonBillableEmployees} icon={<UserX />} />
        <StatCard title="Avg Utilization %" value={`${avgUtilization}%`} icon={<TrendingUp />} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-2 gap-6">

        {/* PIE */}
        <ChartCard title="Billable vs Non‑Billable">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={billablePieData} dataKey="value" label>
                <Cell fill="#22c55e" />
                <Cell fill="#94a3b8" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR */}
        <ChartCard title="Project Allocation">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueProjects}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE */}
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrendData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BENCH */}
        <ChartCard title="Bench Forecast">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={benchForecastData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#a5b4fc" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border p-6 rounded">
      <div className="flex items-center justify-between mb-2 text-sky-700">
        <span className="text-sm">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-semibold text-sky-900">{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border p-6 rounded">
      <h3 className="mb-4 font-medium text-sky-900">{title}</h3>
      {children}
    </div>
  );
}