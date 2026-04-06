import React, { useEffect, useState } from "react";
import {
  Plus,
  ClipboardList,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

/* ============================================================
   SAFE TYPES
============================================================ */

type EmployeeRef = {
  _id: string;
  name: string;
};

interface Project {
  _id: string;
  name: string;
  assignedTo?: string;
}

interface Story {
  _id: string;
  title: string;
  story_points: number;
  project_id: { _id: string; name: string };
}

interface TimesheetEntry {
  _id: string;
  employee_id: string | EmployeeRef | null;
  project_id: Project;
  story_id: Story;
  story_points_completed: number;
  work_date: string;
  status: "Pending" | "Approved" | "Rejected";
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Timesheets() {
  const API_BASE = (import.meta as any).env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;
  const userId = user.id || user._id;

  const [employees, setEmployees] = useState<EmployeeRef[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    employee_id: userId,
    project_id: "",
    story_id: "",
    story_points_completed: "",
    work_date: "",
  });

  const getEmployeeObj = (emp: string | EmployeeRef | null): EmployeeRef => {
    if (!emp) return { _id: "N/A", name: "Unknown" };
    if (typeof emp === "string") {
      const match = employees.find((e) => e._id === emp);
      return match || { _id: emp, name: "Unknown" };
    }
    return emp;
  };

  /* ============================================================
     VALIDATION
  ============================================================= */

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.project_id) newErrors.project_id = "Project is required";
    if (!form.story_id) newErrors.story_id = "Story is required";

    if (!form.story_points_completed) {
      newErrors.story_points_completed = "Points are required";
    } else if (Number(form.story_points_completed) <= 0) {
      newErrors.story_points_completed = "Points must be greater than 0";
    }

    if (!form.work_date) {
      newErrors.work_date = "Date is required";
    } else {
      const selected = new Date(form.work_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected > today) {
        newErrors.work_date = "Future dates are not allowed";
      }
    }

    // Duplicate prevention
    const duplicate = timesheets.find(
      (t) =>
        t.story_id?._id === form.story_id &&
        t.work_date?.split("T")[0] === form.work_date &&
        getEmployeeObj(t.employee_id)._id === userId
    );

    if (duplicate) newErrors.duplicate = "Already submitted for this story/date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ============================================================
     LOAD EVERYTHING (employees → timesheets → projects)
  ============================================================= */

  const loadData = async () => {
    /* Employees */
    let empList: EmployeeRef[] = [];
    if (role === "Employee") {
      empList = [{ _id: userId, name: user.name }];
    } else {
      const empJson = await fetch(`${API_BASE}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      empList = empJson.data || empJson || [];
    }
    setEmployees(empList);

    /* Timesheets */
    const tsJson = await fetch(
      role === "Employee"
        ? `${API_BASE}/api/timesheets/employee/${userId}`
        : `${API_BASE}/api/timesheets`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.json());

    const tsRaw = Array.isArray(tsJson)
      ? tsJson
      : Array.isArray(tsJson.data)
      ? tsJson.data
      : [];

    const normalized = tsRaw.map((t: any) => ({
      ...t,
      employee_id:
        typeof t.employee_id === "string"
          ? empList.find((e) => e._id === t.employee_id) || {
              _id: t.employee_id,
              name: "Unknown",
            }
          : t.employee_id || { _id: "N/A", name: "Unknown" },
    }));

    setTimesheets(normalized);

    /* Projects */
    const projJson = await fetch(`${API_BASE}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    let projList: Project[] = Array.isArray(projJson.data)
      ? projJson.data
      : projJson.data
      ? [projJson.data]
      : [];

    if (role === "Employee") {
      const assigned = projList.filter((p: any) => p.assignedTo === userId);

      const storyJson = await fetch(`${API_BASE}/api/stories`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      const allStories = storyJson.data || [];
      const storyProjectIds = new Set(
        allStories.map((s: any) => s.project_id?._id)
      );

      const available = projList.filter((p) => storyProjectIds.has(p._id));

      projList = [...new Set([...assigned, ...available])];
    }

    setProjects(projList);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================================================
     LOAD STORIES WHEN PROJECT CHANGES
  ============================================================= */

  useEffect(() => {
    if (!form.project_id) return setStories([]);

    fetch(`${API_BASE}/api/stories?project_id=${form.project_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        let list = json.data || [];
        list = list.filter((s: Story) => s.project_id?._id === form.project_id);
        setStories(list);
      });
  }, [form.project_id]);

  /* ============================================================
     SUBMIT TIMESHEET
  ============================================================= */

  const submitTimesheet = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/timesheets/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error);
        return;
      }

      alert("Timesheet Submitted!");

      setForm({
        ...form,
        project_id: "",
        story_id: "",
        story_points_completed: "",
        work_date: "",
      });

      setErrors({});
      loadData();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
   ADMIN ACTIONS (RESTORED)
============================================================ */

const approveTimesheet = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/timesheets/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || data.error || "Failed to approve");
      return;
    }

    loadData();
  } catch (err) {
    alert("Error approving timesheet.");
  }
};

const rejectTimesheet = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/timesheets/reject/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || data.error || "Failed to reject");
      return;
    }

    loadData();
  } catch (err) {
    alert("Error rejecting timesheet.");
  }
};

  /* ============================================================
     FILTERED LIST
  ============================================================= */

  const filtered = timesheets
    .filter((t) => {
      if (role !== "Employee") return true;
      return getEmployeeObj(t.employee_id)._id === userId;
    })
    .filter((t) => {
      const s = search.toLowerCase();
      return (
        getEmployeeObj(t.employee_id).name.toLowerCase().includes(s) ||
        t.project_id.name.toLowerCase().includes(s) ||
        t.story_id.title.toLowerCase().includes(s)
      );
    })
    .filter((t) => statusFilter === "All" || t.status === statusFilter);

  /* ============================================================
     UI
  ============================================================= */

  return (
    <div className="p-6 w-full space-y-8 bg-sky-50">

      {/* HEADER */}
      <div className="bg-sky-200 p-7 rounded-xl shadow-lg flex items-center gap-4">
        <div className="bg-white p-3 rounded-lg shadow">
          <ClipboardList size={28} className="text-sky-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-sky-900">
            Timesheets
          </h1>
          <p className="text-sky-700">Track story-point submissions</p>
        </div>
      </div>

      {/* EMPLOYEE FORM */}
      {role === "Employee" && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-sky-200">
          <h2 className="text-xl font-semibold text-center text-sky-800 mb-6">
            Submit Timesheet
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">

            {/* PROJECT */}
            <div>
              <label className="text-sm mb-2">Project</label>
              <select
                value={form.project_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    project_id: e.target.value,
                    story_id: "",
                  })
                }
                className="w-full px-4 py-2 bg-sky-100 border rounded-lg"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STORY */}
            <div>
              <label className="text-sm mb-2">Story</label>
              <select
                value={form.story_id}
                onChange={(e) =>
                  setForm({ ...form, story_id: e.target.value })
                }
                className="w-full px-4 py-2 bg-sky-100 border rounded-lg"
              >
                <option value="">Select Story</option>
                {stories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} ({s.story_points} pts)
                  </option>
                ))}
              </select>
            </div>

            {/* POINTS */}
            <div>
              <label className="text-sm mb-2">Points Completed</label>
              <input
                type="number"
                value={form.story_points_completed}
                onChange={(e) =>
                  setForm({
                    ...form,
                    story_points_completed: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-sky-100 border rounded-lg"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm mb-2">Date</label>
              <input
                type="date"
                value={form.work_date}
                onChange={(e) => setForm({ ...form, work_date: e.target.value })}
                className="w-full px-4 py-2 bg-sky-100 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={submitTimesheet}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 flex items-center gap-2"
            >
              <Plus size={18} /> Submit Timesheet
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-sky-200 flex flex-wrap justify-center gap-4">

        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg w-full md:w-72">
          <Search size={18} className="text-sky-700" />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-sky-700" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-sky-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sky-100 text-sky-800 text-center">
            <tr>
              <th className="py-3">Employee</th>
              <th className="py-3">Project</th>
              <th className="py-3">Story</th>
              <th className="py-3">Points</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              {(role === "Finance" || role === "Admin") && (
                <th className="py-3">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="text-center">
            {filtered.map((t) => (
              <tr key={t._id} className="border-b hover:bg-sky-50">

                <td className="py-3">{getEmployeeObj(t.employee_id).name}</td>
                <td className="py-3">{t.project_id.name}</td>
                <td className="py-3">{t.story_id.title}</td>
                <td className="py-3">{t.story_points_completed}</td>
                <td className="py-3">{t.work_date.split("T")[0]}</td>

                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      t.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                {(role === "Finance" || role === "Admin") && (
                  <td className="py-3 flex justify-center gap-4">
                    <button
                      onClick={() => approveTimesheet(t._id)}
                      className="p-2 hover:bg-green-50 rounded-full"
                    >
                      <ThumbsUp size={20} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => rejectTimesheet(t._id)}
                      className="p-2 hover:bg-red-50 rounded-full"
                    >
                      <ThumbsDown size={20} className="text-red-600" />
                    </button>
                  </td>
                )}

              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={role === "Finance" || role === "Admin" ? 7 : 6}
                  className="text-center py-10 text-sky-700"
                >
                  No Timesheets Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
