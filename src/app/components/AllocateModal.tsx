import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export function AllocateModal({
  employees,
  projects,
  onClose,
  onSuccess,
}: {
  employees: any[];
  projects: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    employee: "",
    project: "",
    fte: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

const submitAllocation = async () => {
  if (!form.employee || !form.project || form.fte < 1) {
    setError("Please select employee, project and valid FTE");
    return;
  }

  if (form.fte > 160) {
    setError("FTE cannot exceed 160 hours");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await axios.post(
      `${API}/api/allocations`,
      {
        ...form,
        isBillable: true,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    onSuccess();
    onClose();
  } catch (err: any) {
    setError(err.response?.data?.message || "Allocation Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[440px] space-y-4">
        <h2 className="text-lg font-semibold">Allocate Resource</h2>

        {/* Employee */}
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.employee}
          onChange={(e) => handleChange("employee", e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Project */}
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.project}
          onChange={(e) => handleChange("project", e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* FTE */}
        <input
          type="number"
          min={1}
          max={160}
          placeholder="FTE (hours)"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.fte}
          onChange={(e) => handleChange("fte", Number(e.target.value))}
        />

        {/* Month / Year */}
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={12}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.month}
            onChange={(e) => handleChange("month", Number(e.target.value))}
          />
          <input
            type="number"
            min={2024}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.year}
            onChange={(e) => handleChange("year", Number(e.target.value))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submitAllocation}
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded text-sm"
          >
            {loading ? "Allocating…" : "Allocate"}
          </button>
        </div>
      </div>
    </div>
  );
}