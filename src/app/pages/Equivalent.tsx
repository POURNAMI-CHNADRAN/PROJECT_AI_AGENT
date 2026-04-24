import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  X,
  Filter,
  Users,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const FTE_HOURS_PER_UNIT = 160; // 1 FTE = 160 hrs / month
const HOURS_PER_STORY_POINT = 8; // 1 Story Point = 8 hrs

/* =========================================================
   TYPES
========================================================= */

type Equivalent = {
  _id: string;
  title: string;
  description: string;
  effort_type: "FTE" | "STORY_POINTS";
  effort_value: number;
  hours_required: number;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  project_id?: { _id: string; name: string } | string;
  assigned_employee?: { _id: string; name: string } | string | null;
};

type Project = {
  _id: string;
  name: string;
  status: "ACTIVE" | "PLANNED" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  allowAllocations: boolean;
};

type Employee = {
  _id: string;
  name: string;
  freeHours?: number; // backend optional
};

type DraftEquivalent = {
  title: string;
  description: string;
  effort_type: "FTE" | "STORY_POINTS";
  effort_value: number | "";
  project_id: string;
  assigned_employee: string | "";
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
};

/* =========================================================
   HELPERS
========================================================= */

const calcHours = (
  type: "FTE" | "STORY_POINTS",
  value: number | ""
) => {
  const num = Number(value || 0);

  if (!num) return 0;

  if (type === "FTE") return num * FTE_HOURS_PER_UNIT;

  if (type === "STORY_POINTS") return num * HOURS_PER_STORY_POINT;

  return 0;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Equivalents() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("token") || "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user.role;

  const isAdmin = role === "Admin";
  const isFinance = role === "Finance";
  const isEmployee = role === "Employee";

  const canManage = isAdmin || isFinance;

  /* ================= STATE ================= */

  const [items, setItems] = useState<Equivalent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [editItem, setEditItem] = useState<Equivalent | null>(null);

  const [draft, setDraft] = useState<DraftEquivalent>({
    title: "",
    description: "",
    effort_type: "STORY_POINTS",
    effort_value: "",
    project_id: "",
    assigned_employee: "",
    status: "TO_DO",
  });

  /* ================= FILTERS ================= */

  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");

  /* =========================================================
     HELPERS
  ========================================================= */

  const safeJson = async (res: Response) => {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Invalid JSON:", text);
      return {};
    }
  };

  const projectName = (p: any) =>
    typeof p === "object" ? p?.name : "—";

  const projectId = (p: any) =>
    typeof p === "object" ? p?._id : p;

  const employeeName = (e: any) =>
    typeof e === "object" ? e?.name : "—";

  const employeeId = (e: any) =>
    typeof e === "object" ? e?._id : e;

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadAll = async () => {
    try {
      setLoading(true);

      const eqEndpoint = isEmployee
        ? "/api/equivalents/assigned"
        : "/api/equivalents";

      const [eqRes, prRes, empRes] = await Promise.all([
        fetch(`${API_BASE}${eqEndpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),

        fetch(`${API_BASE}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),

        canManage
          ? fetch(`${API_BASE}/api/employees`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : Promise.resolve(null),
      ]);

      const eqJson = await safeJson(eqRes);
      const prJson = await safeJson(prRes);

      setItems(eqJson.data || []);

      const projectList = prJson.data || [];

      setProjects(
        projectList.filter(
          (p: Project) =>
            p.status === "ACTIVE" && p.allowAllocations
        )
      );

      if (empRes) {
        const empJson = await safeJson(empRes);
        setEmployees(empJson.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* =========================================================
     FILTERED DATA
  ========================================================= */

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      if (statusFilter !== "All" && i.status !== statusFilter)
        return false;

      if (
        typeFilter !== "All" &&
        i.effort_type !== typeFilter
      )
        return false;

      if (
        projectFilter !== "All" &&
        projectId(i.project_id) !== projectFilter
      )
        return false;

      if (
        employeeFilter !== "All" &&
        employeeId(i.assigned_employee) !== employeeFilter
      )
        return false;

      return true;
    });
  }, [
    items,
    statusFilter,
    typeFilter,
    projectFilter,
    employeeFilter,
  ]);

  /* =========================================================
     CRUD
  ========================================================= */

  const resetDraft = () =>
    setDraft({
      title: "",
      description: "",
      effort_type: "STORY_POINTS",
      effort_value: "",
      project_id: "",
      assigned_employee: "",
      status: "TO_DO",
    });

  const submitCreate = async () => {
    if (!draft.title.trim()) return alert("Title required");
    if (!draft.project_id) return alert("Project required");
    if (!draft.effort_value) return alert("Effort required");

    const res = await fetch(`${API_BASE}/api/equivalents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...draft,
        effort_value: Number(draft.effort_value),
        hours_required: calcHours(
          draft.effort_type,
          draft.effort_value
        ),
        assigned_employee:
          draft.assigned_employee || null,
      }),
    });

    if (!res.ok) {
      alert("Create failed");
      return;
    }

    resetDraft();
    setShowAdd(false);
    loadAll();
  };

  const submitUpdate = async () => {
    if (!editItem) return;

    const payload = {
      ...editItem,
      project_id: projectId(editItem.project_id),
      assigned_employee:
        employeeId(editItem.assigned_employee) || null,
      hours_required: calcHours(
        editItem.effort_type,
        editItem.effort_value
      ),
    };

    const res = await fetch(
      `${API_BASE}/api/equivalents/${editItem._id}`,
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

    setShowEdit(false);
    setEditItem(null);
    loadAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    await fetch(`${API_BASE}/api/equivalents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadAll();
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-sky-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-sky-200 rounded-xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BookOpen size={28} className="text-sky-700" />

            <div>
              <h1 className="text-2xl font-bold">
                Work Equivalents
              </h1>
              <p className="text-sm text-sky-700">
                FTE / Story Point Planning
              </p>
            </div>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAdd(true)}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg flex gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl border p-4 grid md:grid-cols-4 gap-4">

          <FilterBox
            icon={<Filter size={16} />}
            value={statusFilter}
            setValue={setStatusFilter}
            options={["All", "TO_DO", "IN_PROGRESS", "DONE"]}
          />

          <FilterBox
            icon={<Briefcase size={16} />}
            value={projectFilter}
            setValue={setProjectFilter}
            options={[
              "All",
              ...projects.map((p) => ({
                label: p.name,
                value: p._id,
              })),
            ]}
          />

          <FilterBox
            icon={<BookOpen size={16} />}
            value={typeFilter}
            setValue={setTypeFilter}
            options={["All", "FTE", "STORY_POINTS"]}
          />

          {canManage && (
            <FilterBox
              icon={<Users size={16} />}
              value={employeeFilter}
              setValue={setEmployeeFilter}
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

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {loading ? (
            <p className="p-10 text-center">Loading...</p>
          ) : filteredItems.length === 0 ? (
            <p className="p-10 text-center">
              No records found
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-sky-100">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Effort</th>
                  <th className="p-3 text-center">Hours</th>
                  <th className="p-3 text-center">Project</th>
                  <th className="p-3 text-center">Employee</th>
                  <th className="p-3 text-center">Status</th>
                  {canManage && (
                    <th className="p-3 text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((e) => (
                  <tr
                    key={e._id}
                    className="border-t hover:bg-sky-50"
                  >
                    <td className="p-3">{e.title}</td>

                    <td className="p-3 text-center">
                      {e.effort_type === "FTE"
                        ? "FTE"
                        : "SP"}
                    </td>

                    <td className="p-3 text-center font-semibold">
                      {e.effort_value}
                      {e.effort_type === "FTE"
                        ? " FTE"
                        : " SP"}
                    </td>

                    <td className="p-3 text-center">
                      {e.hours_required}h
                    </td>

                    <td className="p-3 text-center">
                      {projectName(e.project_id)}
                    </td>

                    <td className="p-3 text-center">
                      {employeeName(e.assigned_employee)}
                    </td>

                    <td className="p-3 text-center">
                      {e.status}
                    </td>

                    {canManage && (
                      <td className="p-3">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditItem(e);
                              setShowEdit(true);
                            }}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(e._id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD */}
      {showAdd && (
        <Modal
          title="Add Equivalent"
          close={() => setShowAdd(false)}
        >
          <EquivalentForm
            data={draft}
            setData={setDraft}
            projects={projects}
            employees={employees}
          />

          <button
            onClick={submitCreate}
            className="w-full bg-sky-600 text-white py-2 rounded-lg"
          >
            Save
          </button>
        </Modal>
      )}

      {/* EDIT */}
      {showEdit && editItem && (
        <Modal
          title="Edit Equivalent"
          close={() => {
            setShowEdit(false);
            setEditItem(null);
          }}
        >
          <EquivalentForm
            data={editItem}
            setData={setEditItem}
            projects={projects}
            employees={employees}
          />

          <button
            onClick={submitUpdate}
            className="w-full bg-sky-600 text-white py-2 rounded-lg"
          >
            Update
          </button>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   FILTER BOX
========================================================= */

function FilterBox({
  icon,
  value,
  setValue,
  options,
}: any) {
  return (
    <div className="border rounded-lg px-3 py-2 flex gap-2 items-center">
      {icon}

      <select
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        className="w-full bg-transparent outline-none"
      >
        {options.map((o: any) =>
          typeof o === "string" ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  close,
  children,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[430px] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">
            {title}
          </h2>

          <button onClick={close}>
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* =========================================================
   FORM
========================================================= */

function EquivalentForm({
  data,
  setData,
  projects,
  employees,
}: any) {
  const hours = calcHours(
    data.effort_type,
    data.effort_value
  );

  const selectedEmployee = employees.find(
    (e: Employee) =>
      e._id === data.assigned_employee
  );

  const freeHours =
    selectedEmployee?.freeHours ?? 20;

  const overload = hours > freeHours;

  return (
    <div className="space-y-3">

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={data.title}
        onChange={(e) =>
          setData({
            ...data,
            title: e.target.value,
          })
        }
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={data.description}
        onChange={(e) =>
          setData({
            ...data,
            description: e.target.value,
          })
        }
      />

      <select
        className="w-full border p-2 rounded"
        value={data.project_id}
        onChange={(e) =>
          setData({
            ...data,
            project_id: e.target.value,
          })
        }
      >
        <option value="">Select Project</option>

        {projects.map((p: Project) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={data.effort_type}
        onChange={(e) =>
          setData({
            ...data,
            effort_type: e.target.value,
            effort_value: "",
          })
        }
      >
        <option value="FTE">FTE</option>
        <option value="STORY_POINTS">
          Story Points
        </option>
      </select>

      <input
        type="number"
        step={
          data.effort_type === "FTE"
            ? "0.25"
            : "1"
        }
        className="w-full border p-2 rounded"
        placeholder={
          data.effort_type === "FTE"
            ? "FTE Value"
            : "Story Points"
        }
        value={data.effort_value}
        onChange={(e) =>
          setData({
            ...data,
            effort_value:
              e.target.value === ""
                ? ""
                : Number(e.target.value),
          })
        }
      />

      <div
        className={`p-3 rounded text-sm ${
          overload
            ? "bg-red-50 text-red-700"
            : "bg-sky-50"
        }`}
      >
        <div>
          Hours Required: <b>{hours}h</b>
        </div>

        <div>
          Free Capacity: <b>{freeHours}h</b>
        </div>

        {overload && (
          <div className="flex gap-2 items-center mt-1">
            <AlertTriangle size={14} />
            Over Allocation
          </div>
        )}
      </div>

      <select
        className="w-full border p-2 rounded"
        value={data.assigned_employee || ""}
        onChange={(e) =>
          setData({
            ...data,
            assigned_employee:
              e.target.value,
          })
        }
      >
        <option value="">
          Unassigned
        </option>

        {employees.map((e: Employee) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={data.status}
        onChange={(e) =>
          setData({
            ...data,
            status: e.target.value,
          })
        }
      >
        <option value="TO_DO">TO DO</option>
        <option value="IN_PROGRESS">
          IN PROGRESS
        </option>
        <option value="DONE">DONE</option>
      </select>
    </div>
  );
}