import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Sparkles, Search, Loader2, X, SlidersHorizontal } from "lucide-react";

/* ================= TYPES ================= */
interface Skill {
  _id: string;
  name: string;
  category: string;
  status?: "Active" | "Inactive";
}

/* ================= COMPONENT ================= */
export default function Skills() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canManage = ["Admin", "Finance"].includes(user?.role);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "General" });
  const [saving, setSaving] = useState(false);

  const loadSkills = async () => {
    try {
      if (!token) { setError("Unauthorized"); return; }
      setError("");
      const res = await fetch(`${API_BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSkills(); }, []);

  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills;
    return skills.filter((s) =>
      `${s.name} ${s.category}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [skills, search]);

  const handleAdd = async () => {
    const cleanName = newSkill.name.trim();
    if (!cleanName) return;
    if (cleanName.length > 30) { alert("Maximum 30 characters"); return; }
    if (skills.some(s => s.name.toLowerCase() === cleanName.toLowerCase())) {
      alert("Skill already exists"); return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/skills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cleanName, category: newSkill.category }),
      });
      if (!res.ok) throw new Error("Failed to add skill");
      setShowAdd(false);
      setNewSkill({ name: "", category: "General" });
      loadSkills();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      loadSkills();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 antialiased">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white p-1.5 rounded-xl shadow text-sky-600">
                 <Sparkles size={24} className="text-sky-600" />
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-sky-700">Skills Directory</h1>
            </div>
            <p className="text-slate-500 font-medium">
              Manage your organization's core competencies and talent tags.
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-lg active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Create New Skill</span>
            </button>
          )}
        </header>

        {/* CONTROLS & SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by skill name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-[15px] placeholder:text-slate-400 font-medium transition-all focus:ring-0"
            />
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <p className="text-xs text-amber-800 font-medium">
              Showing {filteredSkills.length} of {skills.length} Total Entries
          </p>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {error && (
            <div className="m-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-sky-700">Skill Name</th>
                <th className="px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-sky-700">Category</th>
                <th className="px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-sky-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <Loader2 className="mx-auto animate-spin text-indigo-400 mb-2" size={32} />
                    <p className="text-slate-400 font-medium">Syncing Database...</p>
                  </td>
                </tr>
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={32} />
                      </div>
                      <h3 className="text-slate-900 font-bold mb-1">No Results Found</h3>
                      <p className="text-slate-500 text-sm">We couldn't find any Skills matching your current Search Criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {skill.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-amber-900 border border-slate-200 uppercase tracking-tighter">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canManage && (
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL - ADD SKILL */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Add New Competency</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Skill Label</label>
                <input
                  autoFocus
                  placeholder="e.g. Advanced TypeScript"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Department / Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none bg-white transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                >
                  {["General", "Frontend", "Backend", "DevOps", "Cloud", "Database", "Tools"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Dismiss
              </button>
              <button
                disabled={saving || !newSkill.name.trim()}
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
              >
                {saving ? "Saving..." : "Create Skill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

