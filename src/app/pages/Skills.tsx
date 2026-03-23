import React, { useEffect, useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

export default function Skills() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "General" });

  // Load all skills
  const loadSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSkills(data.data || []);
    } catch (err) {
      console.log("Skill Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Skill
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSkill),
      });

      if (res.ok) {
        setShowAdd(false);
        setNewSkill({ name: "", category: "General" });
        loadSkills();
      } else {
        alert("Failed to add skill");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Skill
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;

    const res = await fetch(`${API_BASE}/api/skills/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadSkills();
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <div className="p-6 w-full space-y-10 bg-sky-50">

      {/* HEADER */}
      <div className="bg-sky-200 p-7 rounded-xl shadow flex items-center justify-between text-sky-900 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow border border-sky-100">
            <Sparkles size={30} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-sky-700">Manage the skill library for your organization</p>
          </div>
        </div>

        {/* Admin can add */}
        {userRole === "Admin" && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow transition hover:scale-[1.02]"
          >
            <Plus size={18} /> Add Skill
          </button>
        )}
      </div>

 {/* TABLE */}
<div className="bg-white rounded-xl shadow-md border border-sky-200 p-4 animate-fade-in">
  <table className="w-full text-sm table-fixed">

    <thead>
      <tr className="bg-sky-100 text-sky-900 font-semibold">
        <th className="py-2 px-2 text-left w-[40%]">Skill Name</th>
        <th className="py-2 px-2 text-left w-[40%]">Category</th>
        <th className="py-2 px-2 text-center w-[20%]">Action</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan={3} className="p-6 text-center text-sky-700">
            Loading Skills...
          </td>
        </tr>
      ) : skills.length === 0 ? (
        <tr>
          <td colSpan={3} className="p-6 text-center text-sky-700">
            No Skills Found.
          </td>
        </tr>
      ) : (
        skills.map((skill, i) => (
          <tr
            key={skill._id}
            className="border-b hover:bg-sky-50 transition duration-200"
            style={{ animation: `fadeIn .3s ease ${i * 0.05}s both` }}
          >
            {/* Skill Name */}
            <td className="py-3 px-2 font-medium align-middle">
              {skill.name}
            </td>

            {/* Skill Category */}
            <td className="py-3 px-2 align-middle">
              {skill.category}
            </td>

            {/* Action Buttons */}
            <td className="py-3 px-2 text-center align-middle">
              {userRole === "Admin" ? (
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="hover:scale-110 transition duration-150 inline-flex items-center justify-center"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              ) : (
                <span className="text-neutral-400 text-xs">No Access</span>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>

  </table>
</div>

      {/* ADD SKILL MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow space-y-5 border border-sky-200 animate-scale-in">

            <h2 className="text-xl font-bold text-sky-900">Add Skill</h2>

            <input
              className="border border-sky-300 p-2 w-full rounded"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />

            <select
              className="border border-sky-300 p-2 w-full rounded"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            >
              <option>General</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>DevOps</option>
              <option>Cloud</option>
              <option>Soft Skills</option>
              <option>Tools</option>
              <option>Database</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded transition"
                onClick={handleAdd}
              >
                Save Skill
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}



// const skills = [
//   { name: "React", category: "Frontend Development" },
//   { name: "TypeScript", category: "Programming Language" },
//   { name: "Node.js", category: "Backend Development" },
//   { name: "AWS", category: "Cloud Services" },
//   { name: "Python", category: "Programming Language" },
//   { name: "UX Design", category: "Design" },
//   { name: "Project Management", category: "Management" },
//   { name: "SQL", category: "Database" },
// ];

