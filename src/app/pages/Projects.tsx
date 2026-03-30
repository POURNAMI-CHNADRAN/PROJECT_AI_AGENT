import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  Briefcase,
  Building2,
  DollarSign
} from "lucide-react";

/* ================= TYPES ================= */
interface Project {
  _id: string;
  name: string;
  client_id: { _id: string; client_name: string } | string;
  billingModel: "Billable" | "Non-Billable";
  billingRate?: number;
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  assignedTo?: { _id: string; name: string } | string;
}

interface Client {
  _id: string;
  client_name: string;
}

interface Employee {
  _id: string;
  name: string;
}

/* ================= CONSTANTS ================= */
const BILLING_MODEL = {
  BILLABLE: "Billable",
  NON_BILLABLE: "Non-Billable"
};

/* ================= COMPONENT ================= */
export default function Projects() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER STATES ================= */
  const [statusFilter, setStatusFilter] = useState("All");
  const [billingFilter, setBillingFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");

  /* ================= MODALS ================= */
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Project | null>(null);

  /* ================= ADD FORM ================= */
  const [newProject, setNewProject] = useState({
    name: "",
    client_id: "",
    billingModel: BILLING_MODEL.NON_BILLABLE,
    billingRate: undefined as number | undefined,
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    assignedTo: ""
  });

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);

    try {
      const [projRes, clientRes, empRes] = await Promise.all([
        fetch(`${API_BASE}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projJson = await projRes.json();
      const clientJson = await clientRes.json();
      const empJson = await empRes.json();

      // ✅ Normalize ALL responses safely
      const projectsArray = Array.isArray(projJson)
        ? projJson
        : projJson.data || [];

      const clientsArray = Array.isArray(clientJson)
        ? clientJson
        : clientJson.data || [];

      const employeesArray = Array.isArray(empJson)
        ? empJson
        : empJson.data || [];

      // ✅ Normalize billingModel (handles backend inconsistency)
      const normalizedProjects = projectsArray.map((p: any) => ({
        ...p,
        billingModel: p.billingModel ?? p.type ?? "Non-Billable",
      }));

      setProjects(normalizedProjects);
      setFiltered(normalizedProjects);
      setClients(clientsArray);
      setEmployees(employeesArray);
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= FILTERING ================= */
  useEffect(() => {
    let data = [...projects];

    if (statusFilter !== "All") {
      data = data.filter((p) => p.status === statusFilter);
    }

    if (billingFilter !== "All") {
      data = data.filter((p) => p.billingModel === billingFilter);
    }

    if (clientFilter !== "All") {
      data = data.filter(
        (p) =>
          (typeof p.client_id === "string"
            ? p.client_id
            : p.client_id?._id) === clientFilter
      );
    }

    setFiltered(data);
  }, [
    statusFilter,
    billingFilter,
    clientFilter,
    projects
  ]);

  /* ================= HELPERS ================= */
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  const getClientName = (c: any) =>
    typeof c === "string"
      ? clients.find((x) => x._id === c)?.client_name || "Unknown"
      : c?.client_name;

  const getEmployeeName = (e: any) =>
    typeof e === "string"
      ? employees.find((x) => x._id === e)?.name || "—"
      : e?.name || "—";

  /* ================= CRUD ================= */

  const submitAdd = async () => {
    const body: any = { ...newProject };

    if (body.billingModel === BILLING_MODEL.NON_BILLABLE) {
      delete body.billingRate;
    }

    const res = await fetch(`${API_BASE}/api/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowAdd(false);
      loadData();
    } else {
      const err = await res.json();
      alert(err.message || "Add failed");
    }
  };

  const submitEdit = async () => {
    if (!editData) return;

    const body: any = { ...editData };

    if (body.billingModel === BILLING_MODEL.NON_BILLABLE) {
      delete body.billingRate;
    }

    const res = await fetch(`${API_BASE}/api/projects/${editData._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowEdit(false);
      loadData();
    } else {
      alert("Update failed");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete project?")) return;

    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) loadData();
  };

  /* ================= UI ================= */
return (
  <div className="w-full min-h-screen bg-sky-50 py-8">
   <div className="max-w-6xl mx-auto w-full space-y-8 px-4">

      {/* ---------- HEADER ---------- */}
      <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border border-sky-100">
            <Briefcase size={28} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-sky-700 text-sm">
              Track projects, billing, assignments & timelines
            </p>
          </div>
        </div>

        {(userRole === "Admin" || userRole === "HR") && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2 rounded-lg shadow hover:bg-sky-700 hover:scale-105 transition"
          >
            <Plus size={18} /> Add Project
          </button>
        )}
      </div>

      {/* ---------- FILTER SECTION ---------- */}
      <div className="bg-white shadow-sm border border-sky-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        <FilterBox
          icon={<Filter size={18} className="text-sky-600" />}
          value={statusFilter}
          setValue={setStatusFilter}
          options={["All", "ACTIVE", "COMPLETED", "ON_HOLD"]}
        />

        <FilterBox
          icon={<DollarSign size={18} className="text-sky-600" />}
          value={billingFilter}
          setValue={setBillingFilter}
          options={["All", "Billable", "Non-Billable"]}
        />

        <FilterBox
          icon={<Building2 size={18} className="text-sky-600" />}
          value={clientFilter}
          setValue={setClientFilter}
          options={[
            "All",
            ...clients.map((c) => ({ label: c.client_name, value: c._id })),
          ]}
        />
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-4 w-full">
        {loading ? (
          <div className="py-16 text-center text-sky-700">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sky-800">
            <p className="mt-4 text-lg font-medium">No Projects Found</p>
          </div>
        ) : (
          <table className="w-full text-sm table-fixed break-words">            
          <thead>
              <tr className="bg-sky-100 text-sky-800 font-semibold">
                <th className="py-2 px-2 text-center">Project Name</th>
                <th className="py-2 px-2 text-center">Client</th>
                <th className="py-2 px-2 text-center">Billing</th>
                <th className="py-2 px-2 text-center">Rate</th>
                <th className="py-2 px-2 text-center">Start</th>
                <th className="py-2 px-2 text-center">End</th>
                <th className="py-2 px-2 text-center">Status</th>
                <th className="py-2 px-2 text-center">Assigned To</th>
                <th className="py-2 px-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-sky-50 transition transform hover:scale-[1.01]"
                  style={{ animation: `fadeIn .3s ease ${idx * 0.05}s both` }}
                >
                  <td className="py-2 px-2 text-center">{p.name}</td>
                  <td className="py-2 px-2 text-center">{getClientName(p.client_id)}</td>

                  <td className="py-2 px-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.billingModel === BILLING_MODEL.BILLABLE
                          ? "bg-green-100 text-green-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {p.billingModel}
                    </span>
                  </td>

                  <td className="py-2 px-2 text-center">
                    {p.billingModel === BILLING_MODEL.BILLABLE
                      ? `₹${p.billingRate}`
                      : "—"}
                  </td>

                  <td className="py-2 px-2 text-center">{formatDate(p.startDate)}</td>
                  <td className="py-2 px-2 text-center">
                    {p.endDate ? formatDate(p.endDate) : "—"}
                  </td>

                  <td className="py-2 px-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : p.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-2 px-2 text-center">{getEmployeeName(p.assignedTo)}</td>

                  <td className="py-2 px-2 text-center">
                    {(userRole === "Admin" || userRole === "HR") && (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditData(p);
                            setShowEdit(true);
                          }}
                        >
                          <Edit size={16} className="text-sky-700" />
                        </button>

                        <button onClick={() => deleteProject(p._id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------- ADD PROJECT MODAL ---------- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg space-y-3 border border-sky-200 animate-scale-in">

            <h2 className="text-xl font-bold text-sky-800">Add Project</h2>

            {/* NAME */}
            <input
              value={newProject.name}
              className="border border-sky-300 p-2 w-full rounded"
              placeholder="Project Name"
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />

            {/* CLIENT */}
            <select
              value={newProject.client_id}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setNewProject({ ...newProject, client_id: e.target.value })
              }
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.client_name}
                </option>
              ))}
            </select>

            {/* BILLING MODEL */}
            <select
              value={newProject.billingModel}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  billingModel: e.target.value as "Billable" | "Non-Billable"
                })
              }
            >
              <option value="Non-Billable">Non-Billable</option>
              <option value="Billable">Billable</option>
            </select>

            {/* BILLING RATE */}
            {newProject.billingModel === BILLING_MODEL.BILLABLE && (
              <input
                type="number"
                value={newProject.billingRate ?? ""}
                className="border border-sky-300 p-2 w-full rounded"
                placeholder="Billing Rate"
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    billingRate: Number(e.target.value)
                  })
                }
              />
            )}

            {/* START DATE */}
            <input
              type="date"
              value={newProject.startDate}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
            />

            {/* END DATE */}
            <input
              type="date"
              value={newProject.endDate}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setNewProject({ ...newProject, endDate: e.target.value })
              }
            />

            {/* ASSIGN TO */}
            {(userRole === "Admin" || userRole === "HR") && (
              <select
                value={newProject.assignedTo}
                className="border border-sky-300 p-2 w-full rounded"
                onChange={(e) =>
                  setNewProject({ ...newProject, assignedTo: e.target.value })
                }
              >
                <option value="">Assign To</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitAdd}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------- EDIT PROJECT MODAL ---------- */}
      {showEdit && editData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg space-y-3 border border-sky-200 animate-scale-in">

            <h2 className="text-xl font-bold text-sky-800">Edit Project</h2>

            {/* NAME */}
            <input
              value={editData.name ?? ""}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            {/* BILLING MODEL */}
            <select
              value={editData.billingModel}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  billingModel: e.target.value as "Billable" | "Non-Billable"
                })
              }
            >
              <option value="Non-Billable">Non-Billable</option>
              <option value="Billable">Billable</option>
            </select>

            {/* BILLING RATE */}
            {editData.billingModel === BILLING_MODEL.BILLABLE && (
              <input
                type="number"
                value={editData.billingRate ?? ""}
                className="border border-sky-300 p-2 w-full rounded"
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    billingRate: Number(e.target.value)
                  })
                }
              />
            )}

            {/* STATUS */}
            <select
              value={editData.status}
              className="border border-sky-300 p-2 w-full rounded"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status: e.target.value as
                    | "ACTIVE"
                    | "COMPLETED"
                    | "ON_HOLD"
                })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ON_HOLD">ON_HOLD</option>
            </select>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
      </div>
  );
}

/* ================= FILTER BOX COMPONENT ================= */
function FilterBox({
  icon,
  value,
  setValue,
  options
}: {
  icon: React.ReactNode;
  value: string;
  setValue: (v: string) => void;
  options: (string | { label: string; value: string })[];
}) {
  return (
    <div
      className="
        flex items-center gap-2
        w-full
        bg-white
        border border-sky-300 
        rounded-lg 
        px-3 py-2 
        shadow-sm 
        transition 
        hover:border-sky-400 
        focus-within:ring-2 
        focus-within:ring-sky-400
      "
    >
      {/* Left Icon */}
      <div className="text-sky-600">{icon}</div>

      {/* Dropdown */}
      <select
        className="
          w-full 
          outline-none 
          bg-transparent 
          text-sm 
          text-sky-900
        "
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
  );
}
