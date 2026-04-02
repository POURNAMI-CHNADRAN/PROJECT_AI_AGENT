import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Sparkles, Search } from "lucide-react";
import { SkillMapping } from "../components/SkillMapping";

/* ================= API ================= */

export async function syncSkills(employeeId: string, token: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/employees/${employeeId}/sync-skills`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Skill Sync Failed");
  return res.json();
}

/* ================= COMPONENT ================= */

export default function Skills() {
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const token = localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

  const canManage = ["Admin", "HR"].includes(userRole);

  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "General",
  });

  const [saving, setSaving] = useState(false);

  /* ================= LOAD ================= */

  const loadSkills = async () => {
    try {
      if (!token) {
        setError("Unauthorized");
        return;
      }

      setError("");
      const res = await fetch(`${API_BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setSkills(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  /* ================= FILTER ================= */

  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills;

    return skills.filter((s) =>
      `${s.name} ${s.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [skills, search]);

  /* ================= ADD ================= */

  const handleAdd = async () => {
    const cleanName = newSkill.name.trim();

    if (!cleanName) {
      alert("Skill Name Required");
      return;
    }

    if (cleanName.length > 30) {
      alert("Max 30 Characters Allowed");
      return;
    }

    const exists = skills.some(
      (s) => s.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      alert("Skill Already Exists");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/skills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          category: newSkill.category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }

      setShowAdd(false);
      setNewSkill({ name: "", category: "General" });
      loadSkills();
    } catch (err: any) {
      alert(err.message || "Error Adding Skill");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Skill?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Delete Failed");
        return;
      }

      loadSkills();
    } catch {
      alert("Delete Failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-sky-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-200 to-blue-200 p-6 rounded-xl shadow flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="bg-white p-3 rounded-xl shadow">
            <Sparkles size={28} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Skills</h1>
            <p className="text-sm text-gray-600">
              {skills.length} Skills Available
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow border">
        <Search size={16} />
        <input
          placeholder="Search Skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sky-100">
            <tr>
              <th className="text-left px-4 py-3">Skill</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredSkills.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="p-10 text-center text-gray-500">
                    No Skills Found 🚀
                  </div>
                </td>
              </tr>
            ) : (
              filteredSkills.map((skill) => (
                <tr key={skill._id} className="border-t hover:bg-sky-50">
                  <td className="px-4 py-3 font-medium">{skill.name}</td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">
                      {skill.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {canManage ? (
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="hover:scale-110"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No Access
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MAPPING
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="font-semibold text-sky-800 mb-2">
          External Skill Mapping 🔗
        </h2>
        <SkillMapping skills={skills} />
      </div> */}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-lg font-bold">Add Skill</h2>

            <input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <select
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill({
                  ...newSkill,
                  category: e.target.value,
                })
              }
              className="border p-2 w-full rounded text-center"
            >
              <option>General</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>DevOps</option>
              <option>Cloud</option>
              <option>Database</option>
              <option>Tools</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)}>
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleAdd}
                className="bg-sky-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}