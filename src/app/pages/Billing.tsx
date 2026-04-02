import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

/* ---------------- CHART.JS REGISTER ---------------- */
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ScriptableContext,
  type TooltipItem,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

import {
  premiumBarOptions,
  premiumPieOptions,
  premiumLineOptions,
  createGradient,
} from "../../utils/chartConfig";

export type ChartCtx = TooltipItem<any>;

import {
  Plus,
  FileDown,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Users,
  TrendingUp,
  Activity,
  Briefcase,
} from "lucide-react";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import { downloadBillingPDF } from "../../utils/pdfUtils";
import GenerateBillingModal from "../../app/components/billing/GenerateBillingModal";
import RegenerateBillingModal from "../../app/components/billing/RegenerateBillingModal";

/* ---------------- SAFE SKELETON ROW ---------------- */
const BillingSkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 bg-sky-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

/* ---------------- SAFE DATE PARSER ---------------- */
const getMonthKey = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 7);
};

export default function Billing() {
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token || ""}` }),
    [token]
  );

  const [billingData, setBillingData] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [projectFilter, setProjectFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showGenerate, setShowGenerate] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);

  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [billRes, projRes, empRes] = await Promise.all([
        axios.get(`${API_BASE}/api/billing`, { headers }),
        axios.get(`${API_BASE}/api/projects`, { headers }),
        axios.get(`${API_BASE}/api/employees`, { headers }),
      ]);

      setBillingData(Array.isArray(billRes.data) ? billRes.data : []);
      setProjects(projRes.data?.data || projRes.data || []);
      setEmployees(empRes.data?.data || empRes.data || []);
    } catch (err) {
      console.error("Load Error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, headers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------- APPROVED RECORDS ---------------- */
  const approvedRecords = billingData;

  /* ---------------- FILTER LOGIC ---------------- */
  useEffect(() => {
    let data = [...approvedRecords];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (b) =>
          b?.employee_id?.name?.toLowerCase()?.includes(q) ||
          b?.project_id?.name?.toLowerCase()?.includes(q)
      );
    }

    if (projectFilter !== "All") {
      data = data.filter((b) => b?.project_id?._id === projectFilter);
    }

    if (employeeFilter !== "All") {
      data = data.filter((b) => b?.employee_id?._id === employeeFilter);
    }

    if (monthFilter && monthFilter !== "All") {
      data = data.filter(
        (b) => getMonthKey(b?.billing_month) === monthFilter
      );
    }

    setFiltered(data);
  }, [search, projectFilter, employeeFilter, monthFilter, approvedRecords]);

  /* ---------------- ACTIONS ---------------- */
  const handleGenerate = async (form: any) => {
    try {
      await axios.post(
        `${API_BASE}/api/billing/generate`,
        {
          employee_id: form.employee_id,
          project_id: form.project_id,
          month: form.month,
          rate: Number(form.rate || 0),
        },
        { headers }
      );

      setShowGenerate(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Generate Failed");
    }
  };

  const handleRegenerate = async (form: any) => {
    try {
      await axios.put(
        `${API_BASE}/api/billing/regenerate`,
        {
          employee_id: form.employee_id,
          project_id: form.project_id,
          month: form.month,
        },
        { headers }
      );

      setShowRegenerate(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Regenerate Failed");
    }
  };

  /* ---------------- KPI ---------------- */
  const totalApprovedRevenue = useMemo(
    () =>
      approvedRecords.reduce(
        (s, b) => s + (Number(b?.total_revenue) || 0),
        0
      ),
    [approvedRecords]
  );

  const totalApprovedStoryPoints = useMemo(
    () =>
      approvedRecords.reduce(
        (s, b) => s + (Number(b?.story_points_completed) || 0),
        0
      ),
    [approvedRecords]
  );

  const activeProjectsCount = useMemo(
    () =>
      new Set(
        approvedRecords.map((b) => b?.project_id?._id).filter(Boolean)
      ).size,
    [approvedRecords]
  );

  /* ---------------- PREMIUM CHART DATA ---------------- */

const revenueByProject = useMemo<ChartData<"bar">>(() => {
  const projectRevenues = projects.map((p) =>
    approvedRecords
      .filter((b) => b?.project_id?._id === p?._id)
      .reduce((s, b) => s + (Number(b?.total_revenue) || 0), 0)
  );

  return {
    labels: projects.map((p) => p?.name || "Unknown"),

    datasets: [
      {
        label: "Revenue",
        data: projectRevenues,

        backgroundColor: (ctx) =>
          createGradient(ctx, "#38BDF8", "#1D4ED8"),

        hoverBackgroundColor: "#60A5FA",

        borderRadius: 10,
        barThickness: 18, // ✅ clean thickness
      },
    ],
  };
}, [projects, approvedRecords]);

const storyPointsByEmployee = useMemo<ChartData<"doughnut">>(() => {
  const employeePoints = employees.map((e) =>
    approvedRecords
      .filter((b) => b?.employee_id?._id === e?._id)
      .reduce(
        (s, b) => s + (Number(b?.story_points_completed) || 0),
        0
      )
  );

  const baseColors = [
    "#38BDF8", // sky-400
    "#A78BFA", // violet-400
    "#34D399", // emerald-400
    "#FB923C", // orange-400
    "#F472B6", // pink-400
    "#60A5FA", // blue-400
    "#4ADE80", // green-400
    "#FBBF24", // amber-400
  ];

  return {
    labels: employees.map((e) => e?.name || "Unknown"),
    datasets: [
      {
        data: employeePoints,
        backgroundColor: employeePoints.map(
          (_, i) => baseColors[i % baseColors.length]
        ),
        borderWidth: 2,
        borderColor: "#0F172A",
      },
    ],
  };
}, [employees, approvedRecords]);

const monthlyTrend = useMemo<ChartData<"line">>(() => {
  const monthlyData = Array.from({ length: 12 }).map((_, m) =>
    approvedRecords
      .filter((b) => {
        const date = new Date(b?.billing_month);
        return date.getUTCMonth() === m && !isNaN(date.getTime());
      })
      .reduce((s, b) => s + (Number(b?.total_revenue) || 0), 0)
  );

  return {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Revenue",
        data: monthlyData,
        borderColor: "#38BDF8",
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = (ctx as ScriptableContext<"line">).chart;
          if (!chartArea) return "rgba(37,99,235,0.08)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(56,189,248,0.35)");
          g.addColorStop(1, "rgba(37,99,235,0.02)");
          return g;
        },
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };
}, [approvedRecords]);

  /* ---------------- TOTAL FOOTER SAFE ---------------- */
  const filteredTotalRevenue = useMemo(
    () =>
      filtered.reduce(
        (sum, b) => sum + (Number(b?.total_revenue) || 0),
        0
      ),
    [filtered]
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-sky-50">
        <div className="bg-sky-200 p-7 rounded-xl shadow animate-pulse">
          <div className="h-6 w-48 bg-sky-300 rounded mb-3" />
          <div className="h-4 w-80 bg-sky-300 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border p-6 rounded-xl shadow animate-pulse"
            >
              <div className="h-4 w-32 bg-sky-100 rounded mb-3" />
              <div className="h-6 w-20 bg-sky-200 rounded" />
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl shadow">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <BillingSkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ---------------------- Main UI ----------------------
  return (
    <div className="p-6 w-full space-y-8 bg-sky-50">
      {/* ---------------------- Premium Header ---------------------- */}
      <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border border-sky-100">
            <Users size={28} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Billing & Revenue Dashboard</h1>
            <p className="text-sky-700 text-sm mt-1">
              View project revenue, performance analytics & billing reports
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowGenerate(true)}
            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-sky-700 transition"
          >
            <Plus size={18} /> Generate Billing
          </button>

          <button
            onClick={() => setShowRegenerate(true)}
            className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-sky-600 transition"
          >
            <RefreshCw size={18} /> Regenerate Billing
          </button>

          <button
            onClick={() => downloadBillingPDF(filtered)}
            className="flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-lg text-sm font-medium border border-sky-300 shadow hover:bg-sky-100 transition"
          >
            <FileDown size={18} /> Download PDF
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white shadow-sm border border-sky-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        {/* SEARCH */}
        <div className="flex items-center gap-2 border border-sky-300 bg-white px-3 py-2.5 rounded-lg w-full md:w-72 shadow-sm focus-within:ring-2 focus-within:ring-sky-400/30 focus-within:border-sky-400 transition">
          <Search size={16} className="text-sky-600 shrink-0" />
          <input
            type="text"
            placeholder="Search project or employee..."
            className="w-full outline-none text-sm bg-transparent text-sky-900 placeholder:text-sky-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* PROJECT FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 bg-white px-3 py-2.5 rounded-lg focus-within:ring-2 focus-within:ring-sky-400/30 transition">
          <Filter size={16} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent text-sky-900"
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option value={p._id} key={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* EMPLOYEE FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 bg-white px-3 py-2.5 rounded-lg focus-within:ring-2 focus-within:ring-sky-400/30 transition">
          <Filter size={16} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent text-sky-900"
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <option value="All">All Employees</option>
            {employees.map((e) => (
              <option value={e._id} key={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* MONTH FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 bg-white px-3 py-2.5 rounded-lg focus-within:ring-2 focus-within:ring-sky-400/30 transition">
          <Calendar size={16} className="text-sky-600" />
          <input
            type="month"
            className="outline-none text-sm bg-transparent text-sky-900"
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-700 p-6 rounded-2xl shadow-xl text-white">
          <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-sm font-medium text-sky-100">Total Revenue</p>
          <p className="text-3xl font-bold mt-1.5">
            ₹{totalApprovedRevenue.toLocaleString("en-IN")}
          </p>
          <p className="mt-3 text-xs text-sky-200 flex items-center gap-1">
            <TrendingUp size={13} /> All billing records
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-sky-400 to-sky-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-sm font-medium text-sky-100">Total Story Points</p>
          <p className="text-3xl font-bold mt-1.5">{totalApprovedStoryPoints}</p>
          <p className="mt-3 text-xs text-sky-200 flex items-center gap-1">
            <Activity size={13} /> Across all projects
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-sky-800 p-6 rounded-2xl shadow-xl text-white">
          <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-sm font-medium text-sky-100">Active Projects</p>
          <p className="text-3xl font-bold mt-1.5">{activeProjectsCount}</p>
          <p className="mt-3 text-xs text-sky-200 flex items-center gap-1">
            <Briefcase size={13} /> Currently tracked
          </p>
        </div>
      </div>

      {/* BILLING TABLE */}
      <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between">
          <h3 className="text-sky-800 font-semibold">Billing Records</h3>
          <span className="text-xs text-sky-600 bg-sky-100 px-2.5 py-1 rounded-full font-medium">
            {filtered.length} records
          </span>
        </div>

        {billingData.length === 0 ? (
          <div className="py-14 text-center text-sky-800">
            <img
              src="https://illustrations.popsy.co/violet/empty-folder.svg"
              className="h-40 mx-auto opacity-80"
              alt="No data"
            />
            <p className="mt-4 text-lg font-medium">
              No Billing Records Found
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center text-sky-800">
            <p className="mt-4 text-lg font-medium">
              No Records match your Filter
            </p>
          </div>
        ) : (

          <div className="bg-white shadow border border-sky-200 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-sky-100 text-sky-800 text-center">
                <tr>
                  <th className="py-3">Project</th>
                  <th className="py-3">Employee</th>
                  <th className="py-3">Points</th>
                  <th className="py-3">Rate</th>
                  <th className="py-3">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b, idx) => (
                  <tr
                    key={b._id || idx}
                    className="border-b border-sky-100 hover:bg-sky-50 transition-colors"
                    style={{
                      animation: `fadeIn .3s ease ${idx * 0.05}s both`,
                    }}
                  >
                    <td className="py-3 text-center">{b.project_id?.name}</td>
                    <td className="py-3 text-center">{b.employee_id?.name}</td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100">
                        {b.story_points_completed} pts
                      </span>
                    </td>
                    <td className="py-3 text-center">₹{b.billing_rate_per_point}</td>
                    <td className="py-3 font-semibold text-center">₹{b.total_revenue}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-gradient-to-r from-sky-200 to-sky-100 border-t-2 border-sky-300">
                  <td
                    className="py-4 text-center font-extrabold text-sky-900 tracking-wide"
                    colSpan={4}
                  >
                    Total Revenue
                  </td>
                  <td className="py-4 text-center font-extrabold text-sky-900 text-lg">
                    ₹{filteredTotalRevenue.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
              
            </table>
          </div>
        )}
      </div>

      {/* CHARTS */}
      <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* REVENUE BY PROJECT */}
        <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col h-[320px] text-center">
          <div className="flex items-center gap-2 mb-4 text-center">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <h3 className="text-sky-800 text-xs font-semibold uppercase tracking-widest">
              Revenue by Project
            </h3>
          </div>
          <div className="flex-1 relative">
            <Bar data={revenueByProject} options={premiumBarOptions} />
          </div>
        </div>

        {/* STORY POINTS DOUGHNUT */}
        <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <h3 className="text-sky-800 text-xs font-semibold uppercase tracking-widest">
              Story Points by Employee
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Doughnut data={storyPointsByEmployee} options={premiumPieOptions} />
          </div>
        </div>

        {/* MONTHLY TREND */}
        <div className="bg-white border border-sky-100 p-5 rounded-2xl shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <h3 className="text-sky-800 text-xs font-semibold uppercase tracking-widest">
              Monthly Revenue Trend
            </h3>
          </div>
          <div className="flex-1 relative">
            <Line data={monthlyTrend} options={premiumLineOptions} />
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showGenerate && (
        <GenerateBillingModal
          onClose={() => setShowGenerate(false)}
          onGenerate={handleGenerate}
        />
      )}

      {showRegenerate && (
        <RegenerateBillingModal
          onClose={() => setShowRegenerate(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
