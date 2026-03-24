import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Filter,
  Users,
  Briefcase,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

/* ========================= TYPES ========================= */

type Employee = {
  _id: string;
  name: string;
};

type Project = {
  _id: string;
  name: string;
  billingType: "Billable" | "Non-Billable";
};

type BackendAllocation = {
  _id: string;
  employee: Employee | string;
  project: Project | string;
  allocation: number;
  startDate: string;
  endDate: string;
};

type Allocation = {
  _id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  billingType: "Billable" | "Non-Billable";
  allocation: number;
  startDate: string;
  endDate: string;
};

/* Normalize backend → UI */
function normalize(a: BackendAllocation): Allocation {
  return {
    _id: a._id,
    employeeId: typeof a.employee === "object" ? a.employee._id : "",
    employeeName: typeof a.employee === "object" ? a.employee.name : "",
    projectId: typeof a.project === "object" ? a.project._id : "",
    projectName: typeof a.project === "object" ? a.project.name : "",
    billingType: typeof a.project === "object" ? a.project.billingType : "Non-Billable",
    allocation: a.allocation,
    startDate: a.startDate?.slice(0, 10),
    endDate: a.endDate?.slice(0, 10),
  };
}

/* ===================== MAIN COMPONENT ===================== */

export default function ResourceAllocation() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const isAdmin = role === "Admin";
  const isHR = role === "HR";

  /* ------------------ STATES ------------------ */

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterEmployee, setFilterEmployee] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [filterBilling, setFilterBilling] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Allocation | null>(null);

  const emptyForm = {
    employeeId: "",
    projectId: "",
    allocation: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* ------------------ SAFE JSON ------------------ */

  const safeJSON = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Non‑JSON response:", text);
      throw new Error("Invalid JSON");
    }
  };

  /* ------------------ LOAD DATA ------------------ */

  const loadAllocations = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/allocations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await safeJSON(res);
    const normalized = json.data.map((a: BackendAllocation) => normalize(a));

    setAllocations(normalized);
    setLoading(false);
  };

  const loadEmployees = async () => {
    const res = await fetch(`${API_BASE}/api/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await safeJSON(res);
    setEmployees(json.data || json);
  };

  const loadProjects = async () => {
    const res = await fetch(`${API_BASE}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await safeJSON(res);
    setProjects(json.data || json);
  };

  useEffect(() => {
    loadAllocations();
    loadEmployees();
    loadProjects();
  }, []);

  /* ------------------ FILTERS ------------------ */

  const filtered = useMemo(() => {
    return allocations.filter((a) => {
      if (filterEmployee !== "All" && a.employeeId !== filterEmployee)
        return false;
      if (filterProject !== "All" && a.projectId !== filterProject)
        return false;
      if (filterBilling !== "All" && a.billingType !== filterBilling)
        return false;
      return true;
    });
  }, [allocations, filterEmployee, filterProject, filterBilling]);

  /* ------------------ REVENUE CHART (Billable Only) ------------------ */

  const revenueData = useMemo(() => {
    const map: Record<string, { employee: string; bill: number; nonbill: number }> = {};

    allocations.forEach((a) => {
      if (!map[a.employeeId])
        map[a.employeeId] = { employee: a.employeeName, bill: 0, nonbill: 0 };

      if (a.billingType === "Billable") map[a.employeeId].bill += a.allocation;
      else map[a.employeeId].nonbill += a.allocation;
    });

    return Object.values(map);
  }, [allocations]);

  /* ------------------ DELETE ------------------ */

  const deleteAllocation = async (id: string) => {
    if (!confirm("Delete allocation?")) return;

    await fetch(`${API_BASE}/api/allocations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadAllocations();
  };

  /* ------------------ SAVE (Create / Update) ------------------ */

  const saveAllocation = async () => {
    if (!form.employeeId) return alert("Employee is required");
    if (!form.projectId) return alert("Project is required");
    if (!form.allocation) return alert("Allocation % required");
    if (!form.startDate) return alert("Start Date required");
    if (!form.endDate) return alert("End Date required");

    const payload = {
      employee: form.employeeId,
      project: form.projectId,
      allocation: Number(form.allocation),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    const endpoint = editing
      ? `${API_BASE}/api/allocations/${editing._id}`
      : `${API_BASE}/api/allocations`;

    const method = editing ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await safeJSON(res);
    if (!res.ok) {
      alert(json.error || "Failed to save");
      return;
    }

    setShowModal(false);
    loadAllocations();
  };

  /* ========================= UI ========================= */

  return (
    <div className="w-full min-h-screen bg-sky-50 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">

        {/* HEADER */}
        <div className="bg-sky-200 p-8 rounded-xl shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-sky-900">
              Resource Allocation
            </h1>
            <p className="text-sky-700">
              Track billable utilization and resource distribution
            </p>
          </div>

          {(isAdmin || isHR) && (
            <button
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-sky-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-sky-700"
            >
              <Plus size={18} />
              Add Allocation
            </button>
          )}
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPI label="Employees Involved" value={new Set(allocations.map(a => a.employeeId)).size} />
          <KPI label="Projects Involved" value={new Set(allocations.map(a => a.projectId)).size} />
          <KPI label="Total Allocations" value={allocations.length} />
        </div>

        {/* REVENUE CHART */}
        <div className="bg-white p-6 rounded-xl shadow border border-sky-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Revenue Overview (Billable vs Non‑Billable)
          </h2>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="employee" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bill" fill="#0ea5e9" name="Billable (Revenue)" />
                <Bar dataKey="nonbill" fill="#94a3b8" name="Non‑Billable (Cost)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-5 rounded-xl shadow border border-sky-200 grid md:grid-cols-4 gap-4">
          <FilterBox 
            label="Employee"
            value={filterEmployee}
            setValue={setFilterEmployee}
            options={[
              "All",
              ...employees.map(e => ({ label: e.name, value: e._id }))
            ]}
          />

          <FilterBox 
            label="Project"
            value={filterProject}
            setValue={setFilterProject}
            options={[
              "All",
              ...projects.map(p => ({ label: p.name, value: p._id }))
            ]}
          />

          <FilterBox 
            label="Billing Type"
            value={filterBilling}
            setValue={setFilterBilling}
            options={["All", "Billable", "Non-Billable"]}
          />

          <button
            onClick={() => {
              setFilterEmployee("All");
              setFilterProject("All");
              setFilterBilling("All");
            }}
            className="bg-sky-600 text-white rounded-lg py-2 hover:bg-sky-700"
          >
            Reset Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow border border-sky-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Allocation Records
          </h2>

          {loading ? (
            <p className="text-center py-10 text-sky-700">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-100 text-sky-800">
                  <th className="p-2 text-left">Employee</th>
                  <th className="p-2 text-left">Project</th>
                  <th className="p-2 text-center">Billing</th>
                  <th className="p-2 text-center">Allocation %</th>
                  <th className="p-2 text-center">Start</th>
                  <th className="p-2 text-center">End</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(a => (
                  <tr key={a._id} className="border-b hover:bg-sky-50 transition">
                    <td className="p-2">{a.employeeName}</td>
                    <td className="p-2">{a.projectName}</td>
                    <td className="p-2 text-center">
                      <span className="px-3 py-1 text-xs rounded bg-sky-200 text-sky-900">
                        {a.billingType}
                      </span>
                    </td>

                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          a.allocation < 80
                            ? "bg-green-100 text-green-700"
                            : a.allocation < 100
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.allocation}%
                      </span>
                    </td>

                    <td className="p-2 text-center">{a.startDate}</td>
                    <td className="p-2 text-center">{a.endDate || "Ongoing"}</td>

                    <td className="p-2 text-center">
                      {(isAdmin || isHR) && (
                        <div className="flex gap-3 justify-center">
                          <Edit
                            className="cursor-pointer text-sky-700"
                            onClick={() => {
                              setEditing(a);
                              setForm({
                                employeeId: a.employeeId,
                                projectId: a.projectId,
                                allocation: String(a.allocation),
                                startDate: a.startDate,
                                endDate: a.endDate,
                              });
                              setShowModal(true);
                            }}
                          />

                          {isAdmin && (
                            <Trash2
                              className="cursor-pointer text-red-600"
                              onClick={() => deleteAllocation(a._id)}
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <Modal
            employees={employees}
            projects={projects}
            form={form}
            setForm={setForm}
            onSave={saveAllocation}
            onClose={() => setShowModal(false)}
            editing={Boolean(editing)}
          />
        )}
      </div>
    </div>
  );
}

/* ========================= KPI ========================= */

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-sky-200">
      <p className="text-sky-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-sky-900">{value}</p>
    </div>
  );
}

/* ========================= FILTERBOX ========================= */

function FilterBox({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: any[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sky-800 text-sm font-semibold">{label}</label>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-sky-300 rounded-lg px-3 py-2 bg-white"
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

/* ========================= MODAL ========================= */

function Modal({
  employees,
  projects,
  form,
  setForm,
  onSave,
  onClose,
  editing,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg border border-sky-200 space-y-4">

        <h2 className="text-xl font-bold text-sky-900">
          {editing ? "Edit Allocation" : "Add Allocation"}
        </h2>

        {/* EMPLOYEE */}
        <div>
          <label className="text-sm font-semibold text-sky-700">Employee</label>
          <select
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="border border-sky-300 p-2 w-full rounded"
          >
            <option value="">Select Employee</option>
            {employees.map((emp: Employee) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* PROJECT */}
        <div>
          <label className="text-sm font-semibold text-sky-700">Project</label>
          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="border border-sky-300 p-2 w-full rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p: Project) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.billingType})
              </option>
            ))}
          </select>
        </div>

        {/* ALLOCATION */}
        <div>
          <label className="text-sm font-semibold text-sky-700">
            Allocation %
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.allocation}
            onChange={(e) => setForm({ ...form, allocation: e.target.value })}
            className="border border-sky-300 p-2 w-full rounded"
            placeholder="0–100"
          />
        </div>

        {/* START DATE */}
        <div>
          <label className="text-sm font-semibold text-sky-700">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border border-sky-300 p-2 w-full rounded"
          />
        </div>

        {/* END DATE */}
        <div>
          <label className="text-sm font-semibold text-sky-700">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border border-sky-300 p-2 w-full rounded"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            {editing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}