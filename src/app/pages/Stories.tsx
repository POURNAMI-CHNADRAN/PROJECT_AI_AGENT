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

/* ============================================================
   TYPES — MATCH EXACT BACKEND SHAPE
============================================================ */

type Story = {
  _id: string;
  title: string;
  description: string;
  story_points: number;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  project_id?: { _id: string; name: string } | string;
  assigned_employee?: { _id: string; name: string } | string;
};

type Project = { _id: string; name: string; assignedTo?: string };
type Employee = { _id: string; name: string };

type NewStory = {
  title: string;
  description: string;
  story_points: number | "";
  project_id: string;
  assigned_employee: string | null;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Stories() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("token") || "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;
  const isAdmin = role === "Admin";
  const isHR = role === "Finance";
  const isEmployee = role === "Employee";
  const isAdminOrHR = isAdmin || isHR;

  const userId = user.id; // FINAL CONFIRMED FIX

  /* STATES */
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

  /* ============================================================
     SAFE JSON
  ============================================================ */
  const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Non-JSON Response:", text);
      throw new Error("Invalid JSON");
    }
  };

  /* ============================================================
     LOAD STORIES
  ============================================================ */

  const loadStories = async () => {
    try {
      setLoading(true);

      const endpoint = isEmployee
        ? "/api/stories/assigned"
        : "/api/stories";

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

    let list = [];

    // If backend returns a single project object:
    if (json.data && !Array.isArray(json.data)) {
      list = [json.data];
    }
    else if (Array.isArray(json.data)) {
      list = json.data;
    }
    else {
      list = [];
    }

    // Employee sees only their project(s)
    if (isEmployee) {
      setProjects(list.filter((p: any) => p.assignedTo === userId));
    } else {
      setProjects(list);
    }
  };

  const loadEmployees = async () => {
    if (!isAdminOrHR) return;
    const res = await fetch(API_BASE + "/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await safeJson(res);
    setEmployees(json.data || json);
  };

  useEffect(() => {
    loadStories();
    loadProjects();
    loadEmployees();
  }, [role]);

  /* ============================================================
     DELETE STORY
  ============================================================ */
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

  /* ============================================================
     FILTERED LIST
  ============================================================ */
  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      if (statusFilter !== "All" && s.status !== statusFilter) return false;

      if (projectFilter !== "All") {
        const pid =
          typeof s.project_id === "object"
            ? s.project_id._id
            : s.project_id;

        if (pid !== projectFilter) return false;
      }

      if (assignedFilter !== "All" && isAdminOrHR) {
        const aid =
          typeof s.assigned_employee === "object"
            ? s.assigned_employee._id
            : s.assigned_employee;

        if (aid !== assignedFilter) return false;
      }

      return true;
    });
  }, [stories, statusFilter, projectFilter, assignedFilter]);

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="w-full min-h-screen bg-sky-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* HEADER */}
        <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border">
              <BookOpen size={28} className="text-sky-700" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">FTE Management</h1>
              <p className="text-sky-700 text-sm">
                Manage FTE, tasks & assignments
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
              <Plus size={18} /> Add FTE
            </button>
          )}
        </div>

        {/* FILTERS */}
        {isAdminOrHR && (
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
                ...projects.map((p: Project) => ({
                  label: p.name,
                  value: p._id,
                })),
              ]}
            />

            <FilterBox
              label="Assigned To"
              icon={<Users className="text-sky-600" />}
              value={assignedFilter}
              setValue={setAssignedFilter}
              options={[
                "All",
                ...employees.map((e: Employee) => ({
                  label: e.name,
                  value: e._id,
                })),
              ]}
            />

          </div>
        )}
        {/* TABLE */}
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

                    <td className="py-2 px-3 text-center">
                      {s.story_points}
                    </td>

                    {/* EMPLOYEE */}
                    <td className="py-2 px-3 text-center">
                      {typeof s.assigned_employee === "object"
                        ? s.assigned_employee?.name
                        : "—"}
                    </td>

                    {/* PROJECT */}
                    <td className="py-2 px-3 text-center">
                      {typeof s.project_id === "object"
                        ? s.project_id?.name
                        : "—"}
                    </td>

                    {/* STATUS */}
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          s.status === "TO_DO"
                            ? "bg-gray-100 text-gray-700"
                            : s.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {s.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-2 px-3 text-center">

                      {/* ADMIN/Finance */}
                      {isAdminOrHR && (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditStory(s);
                              setShowEditModal(true);
                            }}
                            className="text-sky-700"
                          >
                            <Edit size={16} />
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* EMPLOYEE — icon update */}
                      {isEmployee &&
                        ((typeof s.assigned_employee === "object"
                          ? s.assigned_employee._id
                          : s.assigned_employee) === userId) && (
                          <button
                            onClick={() => {
                              setEditStory(s);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-sky-600 text-white rounded-full shadow 
                                      hover:bg-sky-700 hover:shadow-lg transition-all"
                            title="Update Status"
                          >
                            <Edit size={16} className="text-white" />
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ADD MODAL */}
        {showAddModal && (
          <StoryModal
            title="Add Story"
            story={newStory}
            setStory={setNewStory}
            projects={projects}
            employees={employees}
            role={role}
            onClose={() => setShowAddModal(false)}
            onSubmit={async () => {
              if (!newStory.title.trim()) return alert("Title required");
              if (!newStory.project_id) return alert("Project required");
              if (!newStory.story_points)
                return alert("Story points required");

              const payload = {
                ...newStory,
                story_points: Number(newStory.story_points),
                assigned_employee:
                  newStory.assigned_employee || null,
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
                const err = await safeJson(res);
                alert(err.error || "Failed to create");
                return;
              }

              setShowAddModal(false);
              loadStories();
            }}
          />
        )}

        {/* EDIT MODAL */}
        {showEditModal && editStory && (
          <StoryModal
            title={isEmployee ? "Update Status" : "Edit Story"}
            story={editStory}
            setStory={setEditStory}
            projects={projects}
            employees={employees}
            role={role}
            onClose={() => setShowEditModal(false)}
            onSubmit={async () => {
              if (!editStory) return;

              const payload = {
                ...editStory,
                story_points: Number(editStory.story_points),
                assigned_employee:
                  editStory.assigned_employee || null,
                project_id:
                  typeof editStory.project_id === "object"
                    ? editStory.project_id._id
                    : editStory.project_id,
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

/* ============================================================
   MODAL COMPONENT
============================================================ */

function StoryModal({
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg border space-y-4">

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

/* ============================================================
   FILTER BOX
============================================================ */

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
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-sky-700">{label}</span>

      <div className="flex items-center gap-2 bg-white border border-sky-300 rounded-lg px-3 py-2 shadow-sm">
        <div>{icon}</div>

        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full outline-none bg-transparent text-sm text-sky-900"
        >
          {options.map((opt: any) =>
            typeof opt === "string" ? (
              <option key={opt}>{opt}</option>
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

/* ============================================================
   MODAL FIELDS
============================================================ */

function ModalFields({
  story,
  setStory,
  projects,
  employees,
  role,
}: any) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  return (
    <div className="space-y-3">

      {(role === "Admin" || role === "Finance") && (
        <>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={story.title}
              onChange={(e) =>
                setStory({ ...story, title: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={story.description}
              onChange={(e) =>
                setStory({ ...story, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Story Points</label>
            <input
              type="number"
              value={story.story_points}
              onChange={(e) =>
                setStory({
                  ...story,
                  story_points: Number(e.target.value),
                })
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* PROJECT SELECT */}
          <div>
            <label className="text-sm font-medium">Project</label>
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

              {projects
                .filter((p: any) =>
                  role === "Employee" ? p.assignedTo === userId : true
                )
                .map((p: Project) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* ASSIGNED EMPLOYEE */}
          <div>
            <label className="text-sm font-medium">Assigned To</label>
            <select
              value={
                typeof story.assigned_employee === "object"
                  ? story.assigned_employee._id
                  : story.assigned_employee
              }
              onChange={(e) =>
                setStory({
                  ...story,
                  assigned_employee: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Unassigned</option>
              {employees.map((emp: Employee) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* EMPLOYEE ONLY — STATUS */}
      {role === "Employee" && (
        <div>
          <label className="text-sm font-medium">Update Status</label>
          <select
            value={story.status}
            onChange={(e) =>
              setStory({ ...story, status: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="TO_DO">TO DO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
      )}
    </div>
  );
}