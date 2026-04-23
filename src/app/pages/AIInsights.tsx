import { useState, useEffect } from "react";
import axios from "axios";
import {
  Brain,
  Send,
  Sparkles,
  Loader2,
  TrendingUp,
  Users,
  Briefcase,
  AlertCircle,
  Database,
} from "lucide-react";

const suggestedQueries = [
  "Show underutilized employees below 50%",
  "Who is currently on bench?",
  "Which project has highest resource allocation?",
  "Show revenue summary this month"
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type InsightRow = Record<string, any>;
type AIResponse = {
  query: string;
  answer: string;
  source?: string;
  insights: InsightRow[];
};

type DashboardSummary = {
  totalEmployees: number;
  billableEmployees: number;
  benchCount: number;
  averageUtilizationPct: number;
  revenueForecast: number;
};
/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AIInsights() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kpi, setKpi] = useState<DashboardSummary | null>(null);
  const [kpiLoading, setKpiLoading] = useState(false);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setKpiLoading(true);
        const token = localStorage.getItem("token");
        const now = new Date();

        const res = await axios.get(`${API_BASE}/analytics/dashboard`, {
          params: { month: now.getMonth() + 1, year: now.getFullYear() },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success && res.data?.data?.summary) {
        console.log("✅ DASHBOARD SUMMARY:", res.data.data.summary);
        setKpi(() => res.data.data.summary);
      } else {
        console.error("❌ Invalid Dashboard Response", res.data);
        setKpi(null);
      }
      } catch (err) {
        console.error("Dashboard KPI Error:", err);
      } finally {
        setKpiLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatInsightValue = (val: any, key: string) => {
    if (val === null || val === undefined) return "—";
    if (Array.isArray(val)) return val.length ? val.join(", ") : "—";
    if (typeof val === "object") return JSON.stringify(val);
    if (typeof val === "number") {
      if (/pct|percent|utilization/i.test(key)) return `${val}%`;
      return Number.isInteger(val) ? val : val.toFixed(2);
    }
    return String(val);
  };

  const askAI = async (textQuery?: string) => {
    const query = textQuery || question;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE}/ai/ask`,
        { question: query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse({
        query,
        ...res.data,
        insights: Array.isArray(res.data?.insights) ? res.data.insights : [],
      });
      setQuestion("");
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      setError(err.response?.data?.message || "Failed to fetch AI insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Intelligence Engine
              </h1>
              <p className="text-slate-500 font-medium">
                Enterprise Resource Planning & Forecasting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-xs font-bold uppercase tracking-widest text-slate-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Data Sync
          </div>
        </header>

        {/* SEARCH */}
        <section className="bg-white rounded-3xl border shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="relative">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askAI()}
                placeholder="Ask something like: 'Who is on bench this month?'"
                className="w-full pl-6 pr-32 py-5 bg-slate-50 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                onClick={() => askAI()}
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 px-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Ask AI
              </button>
            </div>
          </div>
        </section>

<div className="flex flex-wrap gap-2 mb-6">
  {suggestedQueries.map((query, i) => (
    <button
      key={i}
      onClick={() => { setQuestion(query); askAI(query); }}
      className="text-xs bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition border border-indigo-100 font-medium"
    >
      {query}
    </button>
  ))}
</div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">
              Analyzing workforce data...
            </p>
          </div>
        )}

        {/* RESULT */}
        {!loading && response && (
          <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">
            <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="text-white font-semibold">
                  AI Generated Report
                </span>
              </div>
              <span className="text-xs italic text-slate-400">
                "{response.query}"
              </span>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                {response.answer}
              </h3>
              {response.insights?.length ? (
                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(response.insights[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-4 text-xs font-bold uppercase text-slate-400"
                          >
                            {key
                              .replace(/_/g, " ")
                              .replace(/([a-z])([A-Z])/g, "$1 $2")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {response.insights.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          {Object.entries(row).map(([key, val]: any, j) => (
                            <td
                              key={j}
                              className="px-6 py-4 text-sm text-slate-600"
                            >
                              {String(formatInsightValue(val, key)).includes("%") ? (
                                <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded">
                                  {formatInsightValue(val, key)}
                                </span>
                              ) : (
                                formatInsightValue(val, key)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 bg-slate-50 border-dashed border-2 rounded-2xl text-slate-400">
                  <Database className="w-10 h-10 mb-2" />
                  No detailed data available
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPI (STATIC / MOCK FOR NOW) */}
        {!kpiLoading && kpi && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<TrendingUp />}
              label="Avg Utilization"
              value={`${kpi.averageUtilizationPct}%`}
            />
            <StatCard
              icon={<Users />}
              label="Bench Strength"
              value={kpi.benchCount}
            />
            <StatCard
              icon={<Briefcase />}
              label="Billable Employees"
              value={kpi.billableEmployees}
            />
            <StatCard
              icon={<AlertCircle />}
              label="Revenue Forecast"
              value={`₹${kpi.revenueForecast.toLocaleString()}`}
            />
          </div>
        )}

        {!kpiLoading && !kpi && (
          <div className="text-center text-slate-400 italic">
            Dashboard data unavailable
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 bg-slate-100 rounded-2xl">{icon}</div>
        <p className="text-slate-500 font-medium">{label}</p>
      </div>
      <h4 className="text-3xl font-black">{value}</h4>
      <p className="text-xs text-slate-400 italic mt-1">Calculated by AllocAI</p>
    </div>
  );
}
