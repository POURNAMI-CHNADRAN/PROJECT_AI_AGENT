import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

interface Department {
  _id: string;
  name: string;
}

interface WorkCategory {
  _id: string;
  name: string;
}

export function CreateEmployeeModal({
  departments,
  onClose,
  onSuccess,
}: {
  departments: Department[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  /* ================= STATE ================= */

  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Employee",
    departmentId: "",
    workCategoryId: "",
    location: "",
    joiningDate: "",
    costPerMonth: "",
    ratePerHour: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD WORK CATEGORIES ================= */

  useEffect(() => {
    const fetchWorkCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/workcategories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWorkCategories(res.data);
      } catch (err) {
        console.error("Failed to load work categories", err);
      }
    };

    fetchWorkCategories();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (k: string, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.role ||
      !form.departmentId ||
      !form.workCategoryId ||
      !form.joiningDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        `${API}/api/employees`,
        {
          ...form,
          costPerMonth: Number(form.costPerMonth),
          ratePerHour: Number(form.ratePerHour),
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
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[480px] space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold text-sky-900">
          Create Employee
        </h2>

        {/* Name */}
        <input
          placeholder="Full name"
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Role */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
        </select>

        {/* Department */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.departmentId}
          onChange={(e) => handleChange("departmentId", e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Work Category */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.workCategoryId}
          onChange={(e) => handleChange("workCategoryId", e.target.value)}
        >
          <option value="">Select Work Category</option>
          {workCategories.map((wc) => (
            <option key={wc._id} value={wc._id}>
              {wc.name}
            </option>
          ))}
        </select>

        {/* Location */}
        <input
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        {/* Joining Date */}
        <input
          type="date"
          className="w-full border px-3 py-2 rounded"
          value={form.joiningDate}
          onChange={(e) => handleChange("joiningDate", e.target.value)}
        />

        {/* Cost & Rate */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Cost / Month"
            className="w-full border px-3 py-2 rounded"
            value={form.costPerMonth}
            onChange={(e) => handleChange("costPerMonth", e.target.value)}
          />
          <input
            type="number"
            placeholder="Rate / Hour"
            className="w-full border px-3 py-2 rounded"
            value={form.ratePerHour}
            onChange={(e) => handleChange("ratePerHour", e.target.value)}
          />
        </div>

        {/* Status */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}