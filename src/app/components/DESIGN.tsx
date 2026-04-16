import {
  X,
  Calendar,
  MapPin,
  Briefcase,
  ArrowRightLeft,
  Clock,
  TrendingUp,
  Edit3,
  Save,
  DollarSign,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AllocateModal } from "./AllocateModal";

const API = import.meta.env.VITE_API_BASE_URL;
const CAPACITY = 160;

interface EmployeeDrawerProps {
  employee: any;
  onClose: () => void;
  canEdit: boolean;
  projects: any[];
  workCategories: any[];
  refetchEmployees: () => void;
}

export default function EmployeeDrawer({
  employee,
  onClose,
  canEdit,
  projects,
  workCategories,
  refetchEmployees,
}: EmployeeDrawerProps) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [allocationMode, setAllocationMode] = useState<"edit" | "move" | null>(null);
  const [activeAllocation, setActiveAllocation] = useState<any>(null);

  const [editForm, setEditForm] = useState({
    joiningDate: "",
    location: "",
    hourlyCost: "",
  });

  useEffect(() => {
    setEditForm({
      joiningDate: employee.joiningDate?.slice(0, 10) || "",
      location: employee.location || "",
      hourlyCost: employee.hourlyCost?.toString() || "",
    });
  }, [employee]);

  const allocations = employee.allocations || [];
  const bookedHours = allocations.reduce((sum: number, item: any) => sum + (item.allocatedHours || 0), 0);
  const remainingHours = Math.max(0, CAPACITY - bookedHours);
  const utilizationPct = Math.round((bookedHours / CAPACITY) * 100);

  // Dynamic color for utilization
  const getUtilColor = (pct: number) => {
    if (pct > 100) return "text-red-600";
    if (pct > 80) return "text-orange-500";
    return "text-emerald-600";
  };

  const experience = useMemo(() => {
    if (!employee.joiningDate) return "—";
    const joined = new Date(employee.joiningDate);
    const now = new Date();
    let years = now.getFullYear() - joined.getFullYear();
    let months = now.getMonth() - joined.getMonth();
    if (months < 0) { years--; months += 12; }
    return years <= 0 ? `${months} Months` : `${years}y ${months}m`;
  }, [employee.joiningDate]);

  const saveEmployeeInfo = async () => {
    try {
      setSavingInfo(true);
      await axios.put(`${API}/api/employees/${employee._id}`, {
        joiningDate: editForm.joiningDate,
        location: editForm.location,
        hourlyCost: Number(editForm.hourlyCost),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditingInfo(false);
      refetchEmployees();
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-sans">
      {/* HEADER - Deep Slate for contrast */}
      <header className="h-24 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {employee.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">
              {employee.employeeCode}
            </span>
            <span className="text-indigo-600 font-semibold text-sm">
              {employee.primaryWorkCategoryId?.name || "General Staff"}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-slate-500"
        >
          <X size={20} />
        </button>
      </header>

      {/* BODY */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 gap-6 p-8">
        
        {/* LEFT PANEL - STATS & INFO */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6 overflow-y-auto pr-2">
          
          <Card title="Personnel Details">
            {!editingInfo ? (
              <div className="space-y-4">
                <Row icon={<Calendar size={16} />} label="Join Date" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "—"} />
                <Row icon={<Briefcase size={16} />} label="Experience" value={experience} />
                <Row icon={<MapPin size={16} />} label="Work Hub" value={employee.location || "Remote"} />
                <Row icon={<DollarSign size={16} />} label="Rate/Hr" value={`$${employee.hourlyCost || 0}`} />
                
                {canEdit && (
                  <button
                    onClick={() => setEditingInfo(true)}
                    className="w-full mt-4 h-11 rounded-xl bg-sky-200 hover:bg-sky-00 text-black font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <Input label="Joining Date" type="date" value={editForm.joiningDate} onChange={(e: any) => setEditForm({...editForm, joiningDate: e.target.value})} />
                <Input label="Location" value={editForm.location} onChange={(e: any) => setEditForm({...editForm, location: e.target.value})} />
                <Input label="Hourly Cost" type="number" value={editForm.hourlyCost} onChange={(e: any) => setEditForm({...editForm, hourlyCost: e.target.value})} />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setEditingInfo(false)} className="h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button onClick={saveEmployeeInfo} className="h-10 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                    {savingInfo ? "..." : <><Save size={14} /> Save</>}
                  </button>
                </div>
              </div>
            )}
          </Card>

          <Card title="Resource Load">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-4xl font-black text-slate-900">{bookedHours}h</span>
                <span className="text-slate-400 font-medium ml-1">/ {CAPACITY}h</span>
              </div>
              <span className={`text-xl font-bold ${getUtilColor(utilizationPct)}`}>
                {utilizationPct}%
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full transition-all duration-500 ${utilizationPct > 100 ? 'bg-red-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.min(utilizationPct, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className={`font-bold ${utilizationPct > 90 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {utilizationPct > 100 ? 'Overloaded' : utilizationPct > 80 ? 'Optimal' : 'Available'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Free Space</p>
                <p className="font-bold text-slate-900">{remainingHours}h</p>
              </div>
            </div>
          </Card>
        </aside>

        {/* RIGHT PANEL - ASSIGNMENTS */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 h-full min-h-0 flex flex-col">
          <Card title="Current Project Assignments" fullHeight>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-2 max-h-full pb-8">
              {allocations.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-cyan-700">
                  <TrendingUp size={40} className="mb-4" />
                  <p className="font-medium">No Projects Assigned</p>
                  <p className="text-sm">This employee is currently on the Bench.</p>
                </div>
              ) : (
                allocations.map((a: any) => (
                  <div key={a._id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-700 transition-colors">
                          {a.projectId?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-slate-500">
                          <Clock size={14} className="text-indigo-500" />
                          <span className="text-sm font-semibold">{a.allocatedHours} Hours / 160 </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        a.isBillable ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {a.isBillable ? "Billable" : "Internal"}
                      </span>
                    </div>

                    {canEdit && (
                      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
                        <button
                          onClick={() => { setActiveAllocation(a); setAllocationMode("edit"); }}
                          className="flex-1 h-9 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => { setActiveAllocation(a); setAllocationMode("move"); }}
                          className="flex-1 h-9 rounded-lg bg-sky-200 text-black text-sm font-bold hover:bg-sky-300 flex items-center justify-center gap-2 transition-colors"
                        >
                          <ArrowRightLeft size={14} /> Move
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </main>

      {/* MODAL */}
      {allocationMode && activeAllocation && (
        <AllocateModal
          mode={allocationMode}
          allocation={activeAllocation}
          projects={projects}
          workCategories={workCategories}
          onClose={() => { setAllocationMode(null); setActiveAllocation(null); }}
          onSuccess={() => { refetchEmployees(); setAllocationMode(null); setActiveAllocation(null); }}
        />
      )}
    </div>
  );
}

/* REFINED UI HELPERS */

function Card({ title, children, fullHeight }: any) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col ${fullHeight ? "h-full" : "h-fit"}`}>
      <h3 className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black mb-5">
        {title}
      </h3>
      <div className={fullHeight ? "flex-1 min-h-0" : ""}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, value }: any) {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <span className="font-bold text-slate-900 text-sm">
        {value}
      </span>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
      />
    </div>
  );
}