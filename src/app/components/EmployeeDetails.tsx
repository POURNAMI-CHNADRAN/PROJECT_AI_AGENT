import {
  X,
  ArrowRightLeft,
  Edit3,
  Save,
  XCircle,
} from "lucide-react";
import { useState, memo } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
const MONTHLY_CAPACITY = 160;

function EmployeeDetails({
  employee,
  onClose,
  onUpdated,
  canEdit,
}: {
  employee: any;
  onClose: () => void;
  onUpdated?: () => void;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    joiningDate: employee.joiningDate
      ? employee.joiningDate.slice(0, 10)
      : "",
    location: employee.location || "",
    hourlyCost: employee.hourlyCost ?? 0,
  });

  /* ---------------- CALCULATIONS ---------------- */
  const allocations = Array.isArray(employee.allocations)
    ? employee.allocations
    : [];

  const bookedHours = allocations.reduce(
    (sum: number, a: any) => sum + (a.allocatedHours || 0),
    0
  );

  const utilization =
    MONTHLY_CAPACITY > 0
      ? Math.round((bookedHours / MONTHLY_CAPACITY) * 100)
      : 0;

  const joiningDateObj = employee.joiningDate
    ? new Date(employee.joiningDate)
    : null;

  const experienceYears = joiningDateObj
    ? Math.floor(
        (Date.now() - joiningDateObj.getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      )
    : null;

  /* ---------------- SAVE ---------------- */
  const saveChanges = async () => {
    try {
      setSaving(true);

      await axios.put(
        `${API}/api/employees/${employee._id}`,
        {
          joiningDate: editForm.joiningDate || null,
          location: editForm.location,
          hourlyCost: Number(editForm.hourlyCost),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditing(false);
      onUpdated?.();

      alert("✅ Saved successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
      <div className="w-[440px] bg-white h-full shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {employee.name}
            </h2>
            <p className="text-sm text-gray-500">
              {employee.employeeCode} ·{" "}
              {employee.primaryWorkCategoryId?.name || "Unassigned"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* UTILIZATION CARD */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Capacity</span>
              <span className="font-medium">{utilization}%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 rounded bg-sky-500"
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>

            <p className="text-xs text-gray-500">
              {bookedHours}h / {MONTHLY_CAPACITY}h used
            </p>
          </div>

          {/* EMPLOYEE INFO */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Employee Info</h3>

              {canEdit && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>

            {!editing ? (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Joining Date</p>
                  <p>{joiningDateObj?.toDateString() || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p>{experienceYears ?? "—"} yrs</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p>{employee.location || "—"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">

                <input
                  type="date"
                  value={editForm.joiningDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      joiningDate: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />

                <input
                  placeholder="Enter location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />

                <input
                  type="number"
                  placeholder="Hourly Cost"
                  value={editForm.hourlyCost}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      hourlyCost: Number(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    <XCircle size={14} /> Cancel
                  </button>

                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-sky-600 text-white rounded-lg
                    hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : (
                      <>
                        <Save size={14} /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTION */}
        {canEdit && (
          <div className="p-6 border-t bg-gray-50">
            <button className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700">
              <ArrowRightLeft size={16} />
              Move Allocation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EmployeeDetails);