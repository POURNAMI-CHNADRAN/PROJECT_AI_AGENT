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
  User,
  Mail,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AllocateModal } from "./AllocateModal";

const API = import.meta.env.VITE_API_BASE_URL;
const CAPACITY = 160;

export default function EmployeeDrawer({
  employee,
  onClose,
  canEdit,
  projects,
  workCategories,
  refetchEmployees,
}: any) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [allocationMode, setAllocationMode] = useState<
    "edit" | "move" | null
  >(null);
  const [activeAllocation, setActiveAllocation] = useState<any>(null);

  const [editForm, setEditForm] = useState({
    joiningDate: "",
    location: "",
    hourlyCost: "",
  });

  useEffect(() => {
    setEditForm({
      joiningDate: employee?.joiningDate?.slice(0, 10) || "",
      location: employee?.location || "",
      hourlyCost: employee?.hourlyCost?.toString() || "",
    });
  }, [employee]);

  const allocations = employee?.allocations || [];

  const bookedHours = allocations.reduce(
    (sum: number, item: any) => sum + (item?.allocatedHours || 0),
    0
  );

  const remainingHours = Math.max(0, CAPACITY - bookedHours);
  const utilizationPct = Math.round((bookedHours / CAPACITY) * 100);

  const getUtilColor = (pct: number) => {
    if (pct > 100) return "text-red-600";
    if (pct > 80) return "text-green-800";
    return "text-emerald-600";
  };

  const experience = useMemo(() => {
    if (!employee?.joiningDate) return "—";

    const joined = new Date(employee.joiningDate);
    const now = new Date();

    let years = now.getFullYear() - joined.getFullYear();
    let months = now.getMonth() - joined.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return years <= 0 ? `${months}m` : `${years}y ${months}m`;
  }, [employee]);

  const saveEmployeeInfo = async () => {
    try {
      setSavingInfo(true);

      await axios.put(
        `${API}/api/employees/${employee._id}`,
        {
          joiningDate: editForm.joiningDate,
          location: editForm.location,
          hourlyCost: Number(editForm.hourlyCost),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditingInfo(false);
      refetchEmployees();
    } finally {
      setSavingInfo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden font-sans">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            {employee?.name?.charAt(0) || "U"}
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">
              {employee?.name}
            </h1>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-sky-700 truncate">
                {employee?.employeeCode}
              </span>

              <span className="w-1 h-1 rounded-full bg-slate-300" />

              <span className="text-indigo-600 font-semibold truncate">
                {employee?.primaryWorkCategoryId?.name || "Staff"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition"
        >
          <X size={18} />
        </button>
      </header>

      {/* BODY */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* LEFT SIDE FIXED */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 bg-white border-r border-slate-200 h-full p-5 flex flex-col justify-between overflow-hidden">
          {/* TOP */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-900">
                Personnel Details
              </h3>

              {canEdit && !editingInfo && (
                <button
                  onClick={() => setEditingInfo(true)}
                  className="p-1.5 rounded-md text-indigo-500 hover:bg-indigo-50 transition"
                >
                  <Edit3 size={14} />
                </button>
              )}
            </div>

            {!editingInfo ? (
              <div className="space-y-4">
                <Row
                //  value={employee?.name?}
                />

                <Row
                  icon={<Calendar size={14} />}
                  label="Join Date"
                  value={
                    employee?.joiningDate
                      ? new Date(employee.joiningDate).toLocaleDateString()
                      : "—"
                  }
                />

                <Row
                  icon={<Briefcase size={14} />}
                  label="Experience"
                  value={experience}
                />

                <Row
                  icon={<MapPin size={14} />}
                  label="Work Hub"
                  value={employee?.location || "Remote"}
                />

                <Row
                  icon={<DollarSign size={14} />}
                  label="Rate/Hr"
                  value={`₹${employee?.hourlyCost?.toLocaleString("en-IN") || 0}`}
                />

                <Row
                  icon={<Mail size={14} />}
                  label="Email"
                  value={employee?.email || "—"}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  label="Joining Date"
                  type="date"
                  value={editForm.joiningDate}
                  onChange={(e: any) =>
                    setEditForm({
                      ...editForm,
                      joiningDate: e.target.value,
                    })
                  }
                />

                <Input
                  label="Location"
                  value={editForm.location}
                  onChange={(e: any) =>
                    setEditForm({
                      ...editForm,
                      location: e.target.value,
                    })
                  }
                />

                <Input
                  label="Hourly Cost"
                  type="number"
                  value={editForm.hourlyCost}
                  onChange={(e: any) =>
                    setEditForm({
                      ...editForm,
                      hourlyCost: e.target.value,
                    })
                  }
                />

                <div className="flex gap-2 pt-2">
                  <IconButton
                    icon={<X size={14} />}
                    onClick={() => setEditingInfo(false)}
                    color="text-slate-600 hover:bg-slate-100"
                  />

                  <button
                    onClick={saveEmployeeInfo}
                    className="flex-1 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    {savingInfo ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-900 mb-4">
              Resource Load
            </h3>

            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-4xl font-black text-slate-900">
                  {bookedHours}h
                </span>

                <span className="text-slate-600 ml-1 text-2xl">/ {CAPACITY}h</span>
              </div>

              <span
                className={`text-lg font-bold ${getUtilColor(
                  utilizationPct
                )}`}
              >
                {utilizationPct}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-4">
              <div
                className={`h-full ${
                  utilizationPct > 100
                    ? "bg-green-500"
                    : utilizationPct > 80
                    ? "bg-green-500"
                    : "bg-indigo-600"
                }`}
                style={{
                  width: `${Math.min(utilizationPct, 100)}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-sky-800 uppercase font-bold">
                  Status
                </p>

                <p
                  className={`font-bold ${
                    utilizationPct > 100
                      ? "text-red-600"
                      : utilizationPct > 80
                      ? "text-green-700"
                      : "text-orange-600"
                  }`}
                >
                  {utilizationPct > 100
                    ? "Overloaded"
                    : utilizationPct > 80
                    ? "Optimal"
                    : "Available"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sky-800 uppercase font-bold">
                  Free Space
                </p>

                <p className="font-bold text-orange-400">
                  {remainingHours}h
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp
                size={17}
                className="text-indigo-500"
              />
              Project Allocations
            </h3>

            <span className="text-xs font-semibold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500">
              {allocations.length} Active
            </span>
          </div>

          {allocations.length === 0 ? (
            <div className="h-52 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <User size={32} className="mb-2 opacity-40" />
              Currently on Bench
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {allocations.map((a: any) => (
                <div
                  key={a._id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-indigo-500 mb-1">
                        Project
                      </p>

                      <h4 className="font-bold text-slate-900 truncate">
                        {a?.projectId?.name || "Unnamed"}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${
                        a.isBillable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.isBillable
                        ? "Billable"
                        : "Internal"}
                    </span>
                  </div>

                  <div className="flex items-center mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-semibold text-sky-700">
                      <Clock size={12} />
                      {a.allocatedHours}h
                    </div>

                    {canEdit && (
                      <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <IconButton
                          icon={<Edit3 size={13} />}
                          onClick={() => {
                            setActiveAllocation(a);
                            setAllocationMode("edit");
                          }}
                          color="text-indigo-600 hover:bg-indigo-50"
                        />

                        <IconButton
                          icon={<ArrowRightLeft size={13} />}
                          onClick={() => {
                            setActiveAllocation(a);
                            setAllocationMode("move");
                          }}
                          color="text-sky-600 hover:bg-sky-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
      {allocationMode && activeAllocation && (
        <AllocateModal
          mode={allocationMode}
          allocation={activeAllocation}
          projects={projects}
          workCategories={workCategories}
          onClose={() => {
            setAllocationMode(null);
            setActiveAllocation(null);
          }}
          onSuccess={() => {
            refetchEmployees();
            setAllocationMode(null);
            setActiveAllocation(null);
          }}
        />
      )}
    </div>
  );
}

/* COMPONENTS */

function Row({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-500 text-xs">
        {icon}
        {label}
      </div>

      <span className="text-xs font-bold text-slate-800 text-right">
        {value}
      </span>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
        {label}
      </label>

      <input
        {...props}
        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function IconButton({
  icon,
  onClick,
  color,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition ${color}`}
    >
      {icon}
    </button>
  );
}


