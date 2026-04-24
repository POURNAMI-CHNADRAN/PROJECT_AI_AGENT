import React, { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Filter, Edit, Trash2, 
  Briefcase, Building2, DollarSign, Calendar, User, ChevronRight, X
} from "lucide-react";

/* ================= TYPES ================= */
interface Project {
  _id: string;
  name: string;
  client_id: { _id: string; client_name: string } | string;

  /* backend structure */
  type: "Billable" | "Non-Billable";
  billingModel: "Fixed" | "Hourly";

  billingRate?: number;
  fixedMonthlyRevenue?: number;

  allowAllocations?: boolean;
  allowMoves?: boolean;

  startDate: string;
  endDate?: string;

  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";

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

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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

  /* ================= HANDLERS ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

/* ================= MEMOIZED FILTERING ================= */
const filteredProjects = useMemo(() => {
  return projects.filter((p) => {
    const matchesStatus =
      filters.status === "All" || p.status === filters.status;

    /* use type instead of billingModel */
    const matchesBilling =
      filters.billing === "All" || p.type === filters.billing;

    const clientId =
      typeof p.client_id === "string"
        ? p.client_id
        : p.client_id?._id;

    const matchesClient =
      filters.client === "All" || clientId === filters.client;

    const matchesSearch = p.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    return (
      matchesStatus &&
      matchesBilling &&
      matchesClient &&
      matchesSearch
    );
  });
}, [projects, filters]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-500 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Portfolio</h1>
            <p className="text-slate-500 text-sm">Oversee project health, billing types, and resource allocation</p>
          </div>
        </div>

        {(userRole === "Admin" || userRole === "Finance") && (
          <button
            onClick={openAddModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-all shadow-md active:scale-95"
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
          icon={<DollarSign size={14} />}
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
              <tr className="bg-sky-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider">Project Details</th>
                <th className="px-6 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider">Economics</th>
                <th className="px-6 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider text-right">Actions</th>
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
                onEdit={() => openEditModal(p)}
                onDelete={() => handleDelete(p._id)}
              />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
      <ProjectModal
        project={editingProject}
        clients={clients}
        employees={employees}
        token={token}
        API_BASE={API_BASE}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setIsModalOpen(false);
          loadData();
        }}
      />
    )}
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
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-fit ${
            project.billingModel === 'Billable'
              ? 'bg-emerald-100 text-emerald-700'
              : project.billingModel === 'Non-Billable'
              ? 'bg-yellow-100 text-yellow-700'
              : project.billingModel === 'Fixed'
              ? 'bg-blue-100 text-blue-700'
              : project.billingModel === 'Hourly'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
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
      <span
        className={`px-3 py-1 rounded-lg text-xs font-bold ${
          project.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
            : project.status === "COMPLETED"
            ? "bg-blue-50 text-blue-600 border border-blue-100"
            : project.status === "ON_HOLD"
            ? "bg-amber-50 text-amber-600 border border-amber-100"
            : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}
      >
        {project.status}
      </span>
      </td>

      <td className="px-6 py-4 text-right">
        {isFinance && (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
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


function ProjectModal({
  project,
  clients,
  employees,
  token,
  API_BASE,
  onClose,
  onSaved,
}: any) {
  const isEdit = !!project;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: project?.name || "",
    client_id: typeof project?.client_id === "string" ? project?.client_id : project?.client_id?._id || "",
    billingModel: project?.billingModel || "Billable",
    billingRate: project?.billingRate || "",
    startDate: project?.startDate ? project.startDate.slice(0, 10) : "",
    endDate: project?.endDate ? project.endDate.slice(0, 10) : "",
    status: project?.status || "ACTIVE",
    assignedTo: typeof project?.assignedTo === "string" ? project?.assignedTo : project?.assignedTo?._id || "",
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, billingRate: Number(form.billingRate) || 0 };
      const url = isEdit ? `${API_BASE}/api/projects/${project._id}` : `${API_BASE}/api/projects`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) onSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all bg-slate-50/50";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEdit ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
              {isEdit ? <Edit size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{isEdit ? "Update Project" : "Create New Project"}</h2>
              <p className="text-xs text-slate-500">Fill in the details to {isEdit ? 'modify' : 'launch'} your project.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* SECTION: GENERAL INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Project Name</label>
              <input
                className={inputClass}
                placeholder="e.g. Phoenix E-commerce Redesign"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Client Partner</label>
              <select className={inputClass} value={form.client_id} onChange={(e) => handleChange("client_id", e.target.value)}>
                <option value="">Select a Client</option>
                {clients.map((c: any) => <option key={c._id} value={c._id}>{c.client_name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Project Lead</label>
              <select className={inputClass} value={form.assignedTo} onChange={(e) => handleChange("assignedTo", e.target.value)}>
                <option value="">Assign Employee</option>
                {employees.map((emp: any) => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION: BILLING */}
          <div className="space-y-4">
            <label className={labelClass}>Billing Configuration</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Billable", "Non-Billable", "Fixed", "Hourly"].map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => handleChange("billingModel", model)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    form.billingModel === model 
                    ? "bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-100" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-sky-300"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <div className="absolute left-4 top-[34px] text-slate-400 group-focus-within:text-sky-500 transition-colors">
                <DollarSign size={16} />
              </div>
              <label className={labelClass}>Billing Rate (INR)</label>
              <input
                type="number"
                className={`${inputClass} pl-10`}
                placeholder="0.00"
                value={form.billingRate}
                onChange={(e) => handleChange("billingRate", e.target.value)}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION: TIMELINE & STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="date" className={`${inputClass} pl-11`} value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Target End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="date" className={`${inputClass} pl-11`} value={form.endDate} onChange={(e) => handleChange("endDate", e.target.value)} />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Project Status</label>
              <div className="flex gap-3">
                {["ACTIVE", "COMPLETED", "ON_HOLD"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleChange("status", status)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      form.status === status 
                      ? "bg-slate-800 border-slate-800 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white hover:shadow-sm transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 shadow-lg shadow-sky-200 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {loading ? "Processing..." : isEdit ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
