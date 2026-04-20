import React, { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Filter, Edit, Trash2, 
  Briefcase, Building2, DollarSign, Calendar, User, ChevronRight
} from "lucide-react";

/* ================= TYPES ================= */
interface Project {
  _id: string;
  name: string;
  client_id: { _id: string; client_name: string } | string;
  billingModel: "Billable" | "Non-Billable";
  billingRate?: number;
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  assignedTo?: { _id: string; name: string } | string;
}

// ... (Client and Employee interfaces remain the same)

export default function Projects() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTERS ================= */
  const [filters, setFilters] = useState({
    status: "All",
    billing: "All",
    client: "All",
    search: ""
  });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Project | null>(null);

  /* ================= DATA LOADING ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };
      const [projRes, clientRes, empRes] = await Promise.all([
        fetch(`${API_BASE}/api/projects`, fetchOptions),
        fetch(`${API_BASE}/api/clients`, fetchOptions),
        fetch(`${API_BASE}/api/employees`, fetchOptions),
      ]);

      const [pData, cData, eData] = await Promise.all([projRes.json(), clientRes.json(), empRes.json()]);

      setProjects(pData.data || pData || []);
      setClients(cData.data || cData || []);
      setEmployees(eData.data || eData || []);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ================= MEMOIZED FILTERING ================= */
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = filters.status === "All" || p.status === filters.status;
      const matchesBilling = filters.billing === "All" || p.billingModel === filters.billing;
      const clientId = typeof p.client_id === "string" ? p.client_id : p.client_id?._id;
      const matchesClient = filters.client === "All" || clientId === filters.client;
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesBilling && matchesClient && matchesSearch;
    });
  }, [projects, filters]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Portfolio</h1>
            <p className="text-slate-500 text-sm">Oversee project health, billing types, and resource allocation</p>
          </div>
        </div>

        {(userRole === "Admin" || userRole === "Finance") && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <FilterSelect 
          icon={<Filter size={14}/>} 
          value={filters.status} 
          onChange={(v: string) => setFilters({ ...filters, status: v })}
          options={["All", "ACTIVE", "COMPLETED", "ON_HOLD"]}
        />

        <FilterSelect 
          icon={<DollarSign size={14}/>} 
          value={filters.billing} 
          onChange={(v: string) => setFilters({ ...filters, billing: v })}
          options={["All", "Billable", "Non-Billable"]}
        />

        <FilterSelect 
          icon={<Building2 size={14}/>} 
          value={filters.client} 
          onChange={(v: string) => setFilters({ ...filters, client: v })}
          options={[{label: "All Clients", value: "All"}, ...clients.map(c => ({label: c.client_name, value: c._id}))]}
        />
      </div>

      {/* PROJECT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Economics</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400">Loading Resources...</td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No Matching Projects Found.</td></tr>
              ) : filteredProjects.map((p) => (
                <ProjectRow 
                  key={p._id} 
                  project={p} 
                  userRole={userRole} 
                  onEdit={() => { setEditData(p); setShowEdit(true); }}
                  onDelete={() => loadData()}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function ProjectRow({ project, userRole, onEdit, onDelete }: any) {
  const isFinance = userRole === "Admin" || userRole === "Finance";

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            {project.name}
            <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
          <Building2 size={12} />
          {project.client_id?.client_name || "Managed Account"}
        </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit ${project.billingModel === 'Billable' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {project.billingModel}
          </span>
          {project.billingRate && (
            <span className="text-sm font-semibold text-slate-700 mt-1">₹{project.billingRate.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ hr</span></span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Calendar size={12} className="text-indigo-400"/> {new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {project.endDate && (
             <span className="text-[10px] text-slate-400 italic">Expected: {new Date(project.endDate).toLocaleDateString()}</span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
          project.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
          project.status === "COMPLETED" ? "bg-blue-50 text-blue-600 border border-blue-100" :
          "bg-amber-50 text-amber-600 border border-amber-100"
        }`}>
          {project.status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        {isFinance && (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

type OptionType = string | { label: string; value: string };

interface FilterSelectProps {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
}

function FilterSelect({ icon, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
      <span className="text-slate-400">{icon}</span>
      <select 
        className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: any) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}