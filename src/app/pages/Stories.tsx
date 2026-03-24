import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Filter,
  BookOpen,
  Users,
  Briefcase,
  Edit,
  Trash2,
} from "lucide-react";

/* ================= TYPES ================= */

type Story = {
  _id: string;
  title: string;
  description: string;
  story_points: number;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  project_id?: { _id: string; name: string } | string;
  assigned_employee?: { _id: string; name: string } | string;
};

type Project = { _id: string; name: string };
type Employee = { _id: string; name: string };

type NewStory = {
  title: string;
  description: string;
  story_points: number | "";
  project_id: string;
  assigned_employee: string | null;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
};

/* ================= MAIN COMPONENT ================= */

export default function Stories() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;
  const isAdminOrHR = role === "Admin" || role === "HR";

  /* ================= STATES ================= */

  const [stories, setStories] = useState<Story[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newStory, setNewStory] = useState<NewStory>({
    title: "",
    description: "",
    story_points: "",
    project_id: "",
    assigned_employee: "",
    status: "TO_DO",
  });

  const [editStory, setEditStory] = useState<Story | null>(null);

  /* ================= SAFE JSON ================= */

  const safeJson = async (res: Response) => {
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      console.error("Server returned non‑JSON:\n\n", txt);
      throw new Error("Invalid JSON");
    }
  };

  /* ================= LOAD DATA ================= */

  const loadStories = async () => {
    try {
      setLoading(true);
      const endpoint =
        role === "Employee" ? "/api/stories/assigned" : "/api/stories";

      const res = await fetch(API_BASE + endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await safeJson(res);
      if (res.ok) setStories(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    const res = await fetch(API_BASE + "/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await safeJson(res);
    setProjects(json.data || json);
  };

  const loadEmployees = async () => {
    const res = await fetch(API_BASE + "/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await safeJson(res);
    setEmployees(json.data || json);
  };

  useEffect(() => {
    if (!token) return;
    loadStories();
    loadProjects();
    loadEmployees();
  }, [token, role]);

  /* ================= DELETE STORY ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story?")) return;

    const res = await fetch(`${API_BASE}/api/stories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await safeJson(res);
    if (!res.ok) return alert(json.error || "Failed to delete");

    loadStories();
  };

  /* ================= FILTER LIST ================= */

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      let pass = true;

      if (statusFilter !== "All" && s.status !== statusFilter) pass = false;

      if (projectFilter !== "All") {
        const projID =
          typeof s.project_id === "object" ? s.project_id._id : s.project_id;
        if (projID !== projectFilter) pass = false;
      }

      if (assignedFilter !== "All") {
        const empID =
          typeof s.assigned_employee === "object"
            ? s.assigned_employee._id
            : s.assigned_employee;
        if (empID !== assignedFilter) pass = false;
      }

      return pass;
    });
  }, [stories, statusFilter, projectFilter, assignedFilter]);

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-sky-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* ---------- HEADER ---------- */}
        <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border">
              <BookOpen size={28} className="text-sky-700" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Story Management</h1>
              <p className="text-sky-700 text-sm">
                Manage stories, sprint tasks & assignments
              </p>
            </div>
          </div>

          {isAdminOrHR && (
            <button
              onClick={() => {
                setNewStory({
                  title: "",
                  description: "",
                  story_points: "",
                  project_id: "",
                  assigned_employee: "",
                  status: "TO_DO",
                });
                setShowAddModal(true);
              }}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition flex items-center gap-2"
            >
              <Plus size={18} /> Add Story
            </button>
          )}
        </div>

        {/* ---------- FILTERS ---------- */}
        <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FilterBox
            label="Status"
            icon={<Filter className="text-sky-600" />}
            value={statusFilter}
            setValue={setStatusFilter}
            options={["All", "TO_DO", "IN_PROGRESS", "DONE"]}
          />

          <FilterBox
            label="Project"
            icon={<Briefcase className="text-sky-600" />}
            value={projectFilter}
            setValue={setProjectFilter}
            options={[
              "All",
              ...projects.map((p) => ({ label: p.name, value: p._id })),
            ]}
          />

          {isAdminOrHR && (
            <FilterBox
              label="Assigned To"
              icon={<Users className="text-sky-600" />}
              value={assignedFilter}
              setValue={setAssignedFilter}
              options={[
                "All",
                ...employees.map((e) => ({
                  label: e.name,
                  value: e._id,
                })),
              ]}
            />
          )}
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-4">
          {loading ? (
            <p className="text-center text-sky-700 py-10">Loading...</p>
          ) : filteredStories.length === 0 ? (
            <p className="text-center text-sky-600 py-10">No stories found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-100 text-sky-800 font-semibold">
                  <th className="py-2 px-3 text-left">Title</th>
                  <th className="py-2 px-3 text-center">Points</th>
                  <th className="py-2 px-3 text-center">Employee</th>
                  <th className="py-2 px-3 text-center">Project</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStories.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b hover:bg-sky-50 transition"
                  >
                    <td className="py-2 px-3">{s.title}</td>
                    <td className="py-2 px-3 text-center">{s.story_points}</td>

                    <td className="py-2 px-3 text-center">
                      {typeof s.assigned_employee === "object"
                        ? s.assigned_employee.name
                        : "—"}
                    </td>

                    <td className="py-2 px-3 text-center">
                      {typeof s.project_id === "object"
                        ? s.project_id.name
                        : "—"}
                    </td>

                    <td className="py-2 px-3 text-center">
                      <span
                        className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          s.status === "TO_DO"
                            ? "bg-gray-100 text-gray-700"
                            : s.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-2 px-3 text-center">
                      {isAdminOrHR && (
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditStory(s);
                              setShowEditModal(true);
                            }}
                            className="text-sky-700"
                          >
                            <Edit size={16} />
                          </button>

                          {(role === "Admin" ||
                            (role === "HR" && s.status === "TO_DO")) && (
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}

                      {role === "Employee" && (
                        <button
                          onClick={() => {
                            setEditStory(s);
                            setShowEditModal(true);
                          }}
                          className="text-sky-700 underline text-xs"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- ADD STORY MODAL ---------- */}
        {showAddModal && (
          <Modal
            title="Add Story"
            story={newStory}
            setStory={setNewStory}
            projects={projects}
            employees={employees}
            role={role}
            onClose={() => setShowAddModal(false)}
            onSubmit={async () => {
              if (!newStory.title.trim())
                return alert("Title is required");
              if (!newStory.project_id)
                return alert("Project is required");
              if (!newStory.story_points)
                return alert("Story points are required");

              const payload = {
                ...newStory,
                story_points: Number(newStory.story_points),
                assigned_employee: newStory.assigned_employee || null,
              };

              const res = await fetch(`${API_BASE}/api/stories`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                const err = await safeJson(res).catch(() => null);
                alert(err?.error || "Failed to create");
                return;
              }

              setShowAddModal(false);
              loadStories();
            }}
          />
        )}

        {/* ---------- EDIT STORY MODAL ---------- */}
        {showEditModal && editStory && (
          <Modal
            title={role === "Employee" ? "Update Status" : "Edit Story"}
            story={editStory}
            setStory={setEditStory}
            projects={projects}
            employees={employees}
            role={role}
            onClose={() => setShowEditModal(false)}
            onSubmit={async () => {
              const payload = {
                ...editStory,
                story_points: Number(editStory.story_points),
                assigned_employee: editStory.assigned_employee || null,
              };

              const res = await fetch(
                `${API_BASE}/api/stories/${editStory._id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                }
              );

              if (!res.ok) {
                alert("Update failed");
                return;
              }

              setShowEditModal(false);
              loadStories();
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function Modal({
  title,
  story,
  setStory,
  projects,
  employees,
  role,
  onClose,
  onSubmit,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg border space-y-4 animate-scale-in">

        <h2 className="text-xl font-bold text-sky-800">{title}</h2>

        <ModalFields
          story={story}
          setStory={setStory}
          projects={projects}
          employees={employees}
          role={role}
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= FILTERBOX ================= */

function FilterBox({
  label,
  icon,
  value,
  setValue,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  setValue: (v: string) => void;
  options: (string | { label: string; value: string })[];
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs font-semibold text-sky-700">{label}</span>

      <div className="flex items-center gap-2 bg-white border border-sky-300 rounded-lg px-3 py-2 shadow-sm">
        <div className="text-sky-600">{icon}</div>

        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full outline-none bg-transparent text-sm text-sky-900"
        >
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}

/* ================= SHARED FIELDS ================= */

function ModalFields({
  story,
  setStory,
  projects,
  employees,
  role,
}: {
  story: any;
  setStory: any;
  projects: Project[];
  employees: Employee[];
  role: string;
}) {
  return (
    <div className="space-y-3">
      {(role === "Admin" || role === "HR") && (
        <div>
          <label className="text-sm text-sky-700 font-medium">Title</label>
          <input
            value={story.title}
            onChange={(e) =>
              setStory({ ...story, title: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {(role === "Admin" || role === "HR") && (
        <div>
          <label className="text-sm text-sky-700 font-medium">Description</label>
          <textarea
            value={story.description}
            onChange={(e) =>
              setStory({ ...story, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {(role === "Admin" || role === "HR") && (
        <div>
          <label className="text-sm text-sky-700 font-medium">Story Points</label>
          <input
            type="number"
            value={story.story_points}
            onChange={(e) =>
              setStory({ ...story, story_points: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {(role === "Admin" || role === "HR") && (
        <div>
          <label className="text-sm text-sky-700 font-medium">Project</label>
          <select
            value={
              typeof story.project_id === "object"
                ? story.project_id._id
                : story.project_id
            }
            onChange={(e) =>
              setStory({ ...story, project_id: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(role === "Admin" || role === "HR") && (
        <div>
          <label className="text-sm text-sky-700 font-medium">Assigned To</label>
          <select
            value={
              typeof story.assigned_employee === "object"
                ? story.assigned_employee._id
                : story.assigned_employee
            }
            onChange={(e) =>
              setStory({ ...story, assigned_employee: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm text-sky-700 font-medium">Status</label>
        <select
          value={story.status}
          onChange={(e) =>
            setStory({ ...story, status: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="TO_DO">TO_DO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>
    </div>
  );
}