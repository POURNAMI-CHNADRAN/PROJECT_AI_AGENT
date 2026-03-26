import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import {
  Plus,
  FileDown,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  Users
} from "lucide-react";

import { Bar, Pie, Line } from "react-chartjs-2";

import { downloadBillingPDF } from "../../utils/pdfUtils";
import { barOptions, donutOptions, lineOptions } from "../../utils/chartConfig";
import { BillingRecord } from "../../types/billingTypes";

import GenerateBillingModal from "../../app/components/billing/GenerateBillingModal";
import RegenerateBillingModal from "../../app/components/billing/RegenerateBillingModal";

// ---------------------- SKELETON ROW ----------------------
const BillingSkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="py-3 px-4">
        <div className="h-4 bg-sky-100 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

export default function Billing() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token"); // ← AUTH TOKEN HERE

  const [billingData, setBillingData] = useState<BillingRecord[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<BillingRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [projectFilter, setProjectFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showGenerate, setShowGenerate] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);

  const [loading, setLoading] = useState(true);

  const createGradient = (ctx: any, color: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color + "FF");  // full opacity
  gradient.addColorStop(1, color + "22");  // soft transparent
  return gradient;
};

  // ---------------------- Load Data ----------------------
const loadData = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");

  try {
    const headers = { Authorization: `Bearer ${token}` };

    const [billRes, projRes, empRes, revRes] = await Promise.all([
      axios.get(`${API_BASE}/api/billing/all`, { headers }),
      axios.get(`${API_BASE}/api/projects`, { headers }),
      axios.get(`${API_BASE}/api/employees`, { headers }),
      axios.get(`${API_BASE}/api/billing/revenue`, { headers })
    ]);

    // FIX: Normalize array structure
    const projectsArray = projRes.data.data || projRes.data;
    const employeesArray = empRes.data.data || empRes.data;
    const billingArray = billRes.data.data || billRes.data;

    setBillingData(billingArray);
    setFiltered(billingArray);

    setProjects(projectsArray);
    setEmployees(employeesArray);

    setTotalRevenue(revRes.data.total);
  } catch (err) {
    console.error("Load error:", err);
  }

  setLoading(false);
};

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------- Filters ----------------------
  useEffect(() => {
    let data = [...billingData];

    if (search.trim()) {
      data = data.filter(
        (b) =>
          b.employee_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
          b.project_id?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (projectFilter !== "All") {
      data = data.filter(
        (b) => b.project_id?._id?.toString() === projectFilter.toString()
      );
    }

    if (employeeFilter !== "All") {
      data = data.filter(
        (b) => b.employee_id?._id?.toString() === employeeFilter.toString()
      );
    }

    if (monthFilter !== "All") {
      data = data.filter(
        (b) =>
          new Date(b.billing_month).toISOString().slice(0, 7) === monthFilter
      );
    }

    setFiltered(data);
  }, [search, projectFilter, employeeFilter, monthFilter, billingData]);

  // ---------------------- Handlers ----------------------
  const handleGenerate = async (form: any) => {
    try {
      await axios.post(`${API_BASE}/api/billing/generate`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowGenerate(false);
      loadData();
    } catch (err) {
      alert("Generate failed");
    }
  };

  const handleRegenerate = async (form: any) => {
    try {
      await axios.put(`${API_BASE}/api/billing/regenerate`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowRegenerate(false);
      loadData();
    } catch (err) {
      alert("Regenerate failed");
    }
  };

  // ---------------------- Charts with memo ----------------------
const revenueByProject = useMemo(() => {
  return {
    labels: projects.map((p) => p.name),
    datasets: [
      {
        label: "Revenue",
        data: projects.map((p) =>
          billingData
            .filter((b) => b.project_id?._id === p._id)
            .reduce((sum, b) => sum + b.total_revenue, 0)
        ),
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx } = chart;
          return createGradient(ctx, "#0284C7");
        },
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: "#0284C7",
      },
    ],
  };
}, [projects, billingData]);

  const storyPointsByEmployee = useMemo(
    () => ({
      labels: employees.map((e) => e.name),
      datasets: [
        {
          label: "Story Points",
          data: employees.map((e) =>
            billingData
              .filter((b) => b.employee_id?._id === e._id)
              .reduce((sum, b) => sum + b.story_points_completed, 0)
          ),
          backgroundColor: ["#0284C7", "#0EA5E9", "#38BDF8", "#7DD3FC"],
        },
      ],
    }),
    [employees, billingData]
  );

  const monthlyTrend = useMemo(
    () => ({
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        {
          label: "Monthly Revenue Trend",
          data: Array.from({ length: 12 }).map((_, month) =>
            billingData
              .filter(
                (b) => new Date(b.billing_month).getMonth() === month
              )
              .reduce((sum, b) => sum + b.total_revenue, 0)
          ),
          borderColor: "#0284C7",
          backgroundColor: "#7DD3FC",
        },
      ],
    }),
    [billingData]
  );

  // ---------------------- Loading Skeleton ----------------------
  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-sky-50">

        {/* Header Skeleton */}
        <div className="bg-sky-200 p-7 rounded-xl shadow animate-pulse">
          <div className="h-6 w-48 bg-sky-300 rounded mb-3"></div>
          <div className="h-4 w-80 bg-sky-300 rounded"></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-sky-200 p-6 rounded-xl shadow animate-pulse">
              <div className="h-4 w-32 bg-sky-100 rounded mb-3"></div>
              <div className="h-6 w-20 bg-sky-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white border border-sky-200 rounded-xl shadow">
          <div className="h-10 bg-sky-100 border-b border-sky-200"></div>
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <BillingSkeletonRow key={idx} />
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

      {/* HEADER */}
      <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center">
        <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border border-sky-100">
            <Users size={28} className="text-sky-700" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Billing & Revenue Dashboard</h1>
          <p className="text-sky-700 text-sm mt-1">
            View project revenue, performance analytics & billing reports
          </p>
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

      {/* ---------------------- FILTERS ---------------------- */}
      <div className="
        bg-white shadow-sm border border-sky-200 rounded-xl p-4 
        flex flex-wrap gap-4 items-center justify-center animate-fade-in
      ">
        
        {/* SEARCH */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg w-full md:w-72 shadow-sm">
          <Search size={18} className="text-sky-600" />
          <input
            type="text"
            placeholder="Search project or employee..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* PROJECT FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-liquid">
          <Filter size={18} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option value={p._id} key={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* EMPLOYEE FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-liquid">
          <Filter size={18} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <option value="All">All Employees</option>
            {employees.map((e) => (
              <option value={e._id} key={e._id}>{e.name}</option>
            ))}
          </select>
        </div>

        {/* MONTH FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-liquid">
          <Calendar size={18} className="text-sky-600" />
          <input
            type="month"
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>
      </div>

      {/* ---------------------- SUMMARY CARDS ---------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="text-sm text-sky-700">Total Revenue</div>
          <div className="text-3xl font-semibold text-sky-900 mt-2">₹{totalRevenue}</div>
        </div>

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="text-sm text-sky-700">Total Story Points</div>
          <div className="text-3xl font-semibold text-sky-900 mt-2">
            {billingData.reduce((sum, b) => sum + b.story_points_completed, 0)}
          </div>
        </div>

        <div className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm">
          <div className="text-sm text-sky-700">Active Projects</div>
          <div className="text-3xl font-semibold text-sky-900 mt-2">
            {new Set(billingData.map((b) => b.project_id?._id)).size}
          </div>
        </div>
      </div>

      {/* ---------------------- CHARTS ---------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REVENUE BY PROJECT */}
        <div className="bg-white border border-sky-200 p-4 rounded-xl shadow-sm">
          <h3 className="text-sky-800 font-semibold mb-3">Revenue by Project</h3>
          <Bar data={revenueByProject} options={barOptions} />
        </div>

        {/* STORY POINTS PIE */}
        <div className="bg-white border border-sky-200 p-4 rounded-xl shadow-sm">
          <h3 className="text-sky-800 font-semibold mb-3">Story Points by Employee</h3>
          <Pie data={storyPointsByEmployee} options={donutOptions} />
        </div>

        {/* MONTHLY TREND */}
        <div className="bg-white border border-sky-200 p-4 rounded-xl shadow-sm">
          <h3 className="text-sky-800 font-semibold mb-3">Monthly Revenue Trend</h3>
          <Line data={monthlyTrend} options={lineOptions} />
        </div>
      </div>

      {/* ---------------------- BILLING TABLE ---------------------- */}
      <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-4 animate-fade-in">
        
        {billingData.length === 0 ? (
          <div className="py-14 text-center text-sky-800">
            <img
              src="https://illustrations.popsy.co/violet/empty-folder.svg"
              className="h-40 mx-auto opacity-80"
            />
            <p className="mt-4 text-lg font-medium">No Billing Records Found</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center text-sky-800">
            <p className="mt-4 text-lg font-medium">No records match your filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm whitespace-nowrap table-fixed">
              <thead>
                <tr className="bg-sky-100 text-sky-800 font-semibold">
                  <th className="py-2 px-4 text-left">Project</th>
                  <th className="py-2 px-4 text-left">Employee</th>
                  <th className="py-2 px-4 text-left">Points</th>
                  <th className="py-2 px-4 text-left">Rate</th>
                  <th className="py-2 px-4 text-left">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b, idx) => (
                  <tr
                    key={b._id}
                    className="border-b hover:bg-sky-50 transition"
                    style={{ animation: `fadeIn .3s ease ${idx * 0.05}s both` }}
                  >
                    <td className="py-2 px-4">{b.project_id?.name}</td>
                    <td className="py-2 px-4">{b.employee_id?.name}</td>
                    <td className="py-2 px-4">{b.story_points_completed}</td>
                    <td className="py-2 px-4">₹{b.billing_rate_per_point}</td>
                    <td className="py-2 px-4 font-semibold text-sky-800">
                      ₹{b.total_revenue}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-sky-100 border-t border-sky-200">
                  <td className="py-2 px-4 font-semibold text-sky-800" colSpan={4}>
                    Total Revenue
                  </td>
                  <td className="py-2 px-4 font-semibold text-sky-800">
                    ₹{filtered.reduce((sum, b) => sum + b.total_revenue, 0)}
                  </td>
                </tr>
              </tfoot>

            </table>
          </div>
        )}
      </div>

      {/* ---------------------- MODALS ---------------------- */}
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