import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */

interface Department {
  _id: string;
  name: string;
}

interface WorkCategory {
  _id: string;
  name: string;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
}

/* ================= COMPONENT ================= */

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
  const [skills, setSkills] = useState<Skill[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    departmentId: "",
    primaryWorkCategoryId: "",
    skills: [] as string[],
    hourlyCost: "",
    joiningDate: "",
    location: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchMasters = async () => {
      try {
        const [wcRes, skillRes] = await Promise.all([
          axios.get(`${API}/api/workcategories`, { headers }),
          axios.get(`${API}/api/skills`, { headers }),
        ]);

        setWorkCategories(
          Array.isArray(wcRes.data) ? wcRes.data : wcRes.data.data ?? []
        );

        setSkills(
          Array.isArray(skillRes.data)
            ? skillRes.data
            : skillRes.data.data ?? []
        );
      } catch (err) {
        console.error("Failed to load master data", err);
      }
    };

    fetchMasters();
  }, []);

  /* ================= HELPERS ================= */

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleSkill = (skillId: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.departmentId ||
      !form.primaryWorkCategoryId
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
          name: form.name,
          email: form.email,
          departmentId: form.departmentId,
          primaryWorkCategoryId: form.primaryWorkCategoryId,
          skills: form.skills,
          hourlyCost: Number(form.hourlyCost),
          joiningDate: form.joiningDate || undefined,
          location: form.location || undefined,
          status: form.status,
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
      <div className="bg-white rounded-xl p-6 w-[520px] space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold text-sky-900">
          Create Employee
        </h2>

        {/* Name */}
        <input
          placeholder="Full name"
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />

        {/* Department */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.departmentId}
          onChange={(e) => updateField("departmentId", e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Primary Work Category */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.primaryWorkCategoryId}
          onChange={(e) =>
            updateField("primaryWorkCategoryId", e.target.value)
          }
        >
          <option value="">Select Primary Work Category</option>
          {workCategories.map((wc) => (
            <option key={wc._id} value={wc._id}>
              {wc.name}
            </option>
          ))}
        </select>

        {/* Skills */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-sky-900">
            Skills
          </label>

          <div className="flex flex-wrap gap-3">
            {skills.map((s) => {
              const selected = form.skills.includes(s._id);
              return (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => toggleSkill(s._id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold
                    ${selected
                      ? "bg-emerald-600 text-white"
                      : "bg-sky-100 text-sky-700 hover:bg-sky-200"}
                  `}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Joining Date */}
        <input
          type="date"
          className="w-full border px-3 py-2 rounded"
          value={form.joiningDate}
          onChange={(e) => updateField("joiningDate", e.target.value)}
        />

        {/* Location */}
        <input
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />

        {/* Hourly Cost */}
        <input
          type="number"
          placeholder="Hourly Cost"
          className="w-full border px-3 py-2 rounded"
          value={form.hourlyCost}
          onChange={(e) => updateField("hourlyCost", e.target.value)}
        />

        {/* Status */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.status}
          onChange={(e) =>
            updateField("status", e.target.value as "Active" | "Inactive")
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
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