import {
  X,
  Calendar,
  MapPin,
  Briefcase,
  Edit3,
  ArrowRightLeft,
  Save,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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

  /* ================= EMPLOYEE INFO EDIT ================= */

  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const [editForm, setEditForm] = useState({
    joiningDate: employee.joiningDate
      ? employee.joiningDate.slice(0, 10)
      : "",
    location: employee.location || "",
    hourlyCost:
      employee.hourlyCost !== undefined && employee.hourlyCost !== null
        ? String(employee.hourlyCost)
        : "",
  });

  const saveEmployeeInfo = async () => {
    try {
      setSavingInfo(true);
      await axios.put(
        `${API}/api/employees/${employee._id}`,
        {
          joiningDate: editForm.joiningDate || null,
          location: editForm.location,
          hourlyCost: editForm.hourlyCost
            ? Number(editForm.hourlyCost)
            : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingInfo(false);
    } finally {
      setSavingInfo(false);
    }
  };

  /* ================= ALLOCATIONS ================= */

  const allocations = Array.isArray(employee.allocations)
    ? employee.allocations
    : [];

  const bookedHours = allocations.reduce(
    (sum: number, a: any) => sum + (a.allocatedHours || 0),
    0
  );

  const remainingHours = CAPACITY - bookedHours;

  const utilizationPct =
    CAPACITY > 0 ? Math.round((bookedHours / CAPACITY) * 100) : 0;

  const utilizationLabel =
    bookedHours < CAPACITY
      ? "Underutilized"
      : bookedHours === CAPACITY
      ? "Optimal"
      : "Overallocated";

  /* ================= ALLOCATION MODAL STATE ================= */

  const [allocationMode, setAllocationMode] =
    useState<"edit" | "move" | null>(null);
  const [activeAllocation, setActiveAllocation] = useState<any>(null);

  /* ================= EXPERIENCE ================= */

  const joiningDateObj = employee.joiningDate
    ? new Date(employee.joiningDate)
    : null;

  const experienceYears = joiningDateObj
    ? Math.floor(
        (Date.now() - joiningDateObj.getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[420px] bg-white shadow-xl h-full flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-gray-500">
              {employee.employeeCode} ·{" "}
              {employee.primaryWorkCategoryId?.name || "Unassigned"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* EMPLOYEE INFO */}
          <Section
            title={
              <div className="flex justify-between items-center">
                <span>Employee Info</span>
                {canEdit && !editingInfo && (
                  <button
                    onClick={() => setEditingInfo(true)}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Edit Employee Info"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
            }
          >
            {!editingInfo ? (
              <>
                <InfoRow
                  icon={<Calendar size={14} />}
                  label="Joining Date"
                  value={joiningDateObj?.toDateString() || "—"}
                />
                <InfoRow
                  icon={<Briefcase size={14} />}
                  label="Experience"
                  value={
                    experienceYears !== null
                      ? `${experienceYears} yrs`
                      : "—"
                  }
                />
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={employee.location || "—"}
                />
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={editForm.joiningDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, joiningDate: e.target.value })
                  }
                />
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Hourly Cost"
                  className="w-full border px-3 py-2 rounded"
                  value={editForm.hourlyCost}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setEditForm({
                        ...editForm,
                        hourlyCost: e.target.value,
                      });
                    }
                  }}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingInfo(false)}
                    className="border px-3 py-1.5 rounded flex items-center gap-1"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                  <button
                    onClick={saveEmployeeInfo}
                    disabled={savingInfo}
                    className="bg-sky-600 text-white px-3 py-1.5 rounded flex items-center gap-1"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* CAPACITY */}
          <Section title="Capacity">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monthly Utilization</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    utilizationLabel === "Underutilized"
                      ? "bg-amber-50 text-amber-700"
                      : utilizationLabel === "Optimal"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {utilizationLabel}
                </span>
              </div>

              <div className="text-xl font-semibold">
                {bookedHours}h / {CAPACITY}h
              </div>

              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    utilizationPct < 100
                      ? "bg-yellow-400"
                      : utilizationPct === 100
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{utilizationPct}%</span>
                <span
                  className={`font-medium flex items-center gap-1 ${
                    remainingHours < 0
                      ? "text-red-600"
                      : remainingHours < 20
                      ? "text-amber-600"
                      : "text-green-600"
                  }`}
                >
                  {remainingHours < 0 ? "⚠️" : remainingHours < 20 ? "⏳" : "✅"}
                  Remaining: {remainingHours}h
                </span>
              </div>
            </div>
          </Section>

          {/* CURRENT ALLOCATION */}
          <Section title="Current Allocation">
            {allocations.length === 0 && (
              <div className="bg-yellow-50 border p-3 text-sm rounded">
                No active allocations — employee is on bench.
              </div>
            )}

            {allocations.map((a: any) => (
              <div
                key={a._id}
                className="border rounded-lg p-3 flex justify-between items-center mt-2 hover:bg-gray-50 transition"
              >
                <div>
                  <div className="font-medium">{a.projectId?.name}</div>
                  <div className="text-xs text-gray-500">
                    {a.allocatedHours}h ·{" "}
                    {a.isBillable ? "Billable" : "Non‑Billable"}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      className="p-1.5 rounded hover:bg-sky-50 text-sky-600"
                      title="Edit Allocation"
                      onClick={() => {
                        setActiveAllocation(a);
                        setAllocationMode("edit");
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                      title="Move Allocation"
                      onClick={() => {
                        setActiveAllocation(a);
                        setAllocationMode("move");
                      }}
                    >
                      <ArrowRightLeft size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Section>
        </div>

        {/* ALLOCATION MODAL */}
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
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <div className="flex gap-2 text-gray-500">
        {icon}
        {label}
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}