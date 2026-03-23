import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  ChevronDown,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

// ======================== INTERFACES ========================
interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  departmentId: string | { _id: string; name: string };
  location: string;
  joiningDate: string;
  costPerMonth: number;
  status: string;
}

interface Department {
  _id: string;
  name: string;
}

// ======================== COMPONENT ========================
export default function Employees() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Employee | null>(null);

  const token = localStorage.getItem("token");

  // ======================== FETCH DATA ========================
  const loadData = async () => {
    setLoading(true);

    try {
      const empRes = await fetch(`${API_BASE}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const depRes = await fetch(`${API_BASE}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const empJson = await empRes.json();
      const depJson = await depRes.json();

      const employeesData = empJson.data || empJson;

      setEmployees(employeesData);
      setFiltered(employeesData);
      setDepartments(depJson);
    } catch (error) {
      console.error("Load error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ======================== FILTER ========================
  useEffect(() => {
    let data = [...employees];

    if (search.trim()) {
      data = data.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "All") data = data.filter((e) => e.role === roleFilter);

    if (deptFilter !== "All") {
      data = data.filter(
        (e) =>
          (typeof e.departmentId === "string"
            ? e.departmentId
            : e.departmentId?._id) === deptFilter
      );
    }

    if (statusFilter !== "All")
      data = data.filter((e) => e.status === statusFilter);

    setFiltered(data);
  }, [search, roleFilter, deptFilter, statusFilter, employees]);

  const getDeptName = (dept: any) => {
    if (!dept) return "Unknown";
    if (typeof dept === "string") {
      return departments.find((d) => d._id === dept)?.name || "Unknown";
    }
    return dept.name;
  };

  // ======================== CRUD ========================
  const deleteEmployee = async (id: string) => {
    if (!confirm("Deactivate this employee?")) return;

    const res = await fetch(`${API_BASE}/api/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadData();
  };

  const submitEdit = async () => {
    if (!editData) return;

    const res = await fetch(`${API_BASE}/api/employees/${editData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (res.ok) {
      setShowEdit(false);
      loadData();
    }
  };

  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    departmentId: "",
    location: "",
    joiningDate: "",
    costPerMonth: 0,
  });

  const submitAdd = async () => {
    const res = await fetch(`${API_BASE}/api/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmp),
    });

    if (!res.ok) {
      alert("Add failed — check required fields");
      return;
    }

    setShowAdd(false);
    loadData();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ======================== SKELETON LOADER ========================
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-sky-100 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  // ======================== UI START ========================
  return (
    <div className="p-6 w-full space-y-8 bg-sky-50">

      {/* ---------------------- Premium Header ---------------------- */}
      <div className="bg-sky-200 p-7 rounded-xl shadow-lg text-sky-900 flex justify-between items-center animate-fade-slide-down">
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md border border-sky-100">
            <Users size={28} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Employees</h1>
            <p className="text-sky-700 text-sm">
              Manage employee details, roles, access & assignments
            </p>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-sky-700 transition hover:scale-105 active:scale-95"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* ---------------------- Filters ---------------------- */}
      <div className="
        bg-white shadow-sm border border-sky-200 rounded-xl p-4 
        flex flex-wrap gap-4 items-center justify-center
        animate-fade-in w-full
      ">
        {/* SEARCH */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg w-full md:w-72 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition">
          <Search size={18} className="text-sky-600" />
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ROLE FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg shadow-sm bg-white hover:border-sky-400 transition">
          <Filter size={18} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All</option>
            <option>Admin</option>
            <option>HR</option>
            <option>Employee</option>
          </select>
        </div>

        {/* DEPARTMENT FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg shadow-sm hover:border-sky-400 transition">
          <Building2 size={18} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2 border border-sky-300 px-3 py-2 rounded-lg shadow-sm hover:border-sky-400 transition">
          <ChevronDown size={18} className="text-sky-600" />
          <select
            className="outline-none text-sm bg-transparent"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* ---------------------- Table ---------------------- */}
      <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-4 animate-fade-in">

        {loading ? (
          <table className="w-full text-sm">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sky-800">
            <img
              src="https://illustrations.popsy.co/purple/empty-folder.svg"
              className="h-40 mx-auto opacity-80"
            />
            <p className="mt-4 text-lg font-medium">No Employees Found</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-sm whitespace-nowrap table-fixed">

              <thead>
                <tr className="bg-sky-100 text-sky-800 font-semibold">
                  <th className="py-2 px-2 text-center w-[60px]">Emp ID</th>
                  <th className="py-2 px-2 text-center w-[120px]">Name</th>
                  <th className="py-2 px-2 text-center w-[90px]">Role</th>
                  <th className="py-2 px-2 text-center w-[110px]">Department</th>
                  <th className="py-2 px-2 text-center w-[110px]">Location</th>
                  <th className="py-2 px-2 text-center w-[100px]">Date of Joining</th>
                  <th className="py-2 px-2 text-center w-[90px]">Cost/Month</th>
                  <th className="py-2 px-2 text-center w-[70px]">Status</th>
                  <th className="py-2 px-2 text-center w-[60px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((e, idx) => (
                  <tr
                    key={e._id}
                    className="border-b hover:bg-sky-50 transition transform hover:scale-[1.01]"
                    style={{ animation: `fadeIn .3s ease ${idx * 0.05}s both` }}
                  >
                    <td className="py-2 px-2 text-center">{e.employeeId}</td>
                    <td className="py-2 px-2 text-center font-medium">
                      {e.name}
                    </td>
                    <td className="py-2 px-2 text-center">{e.role}</td>
                    <td className="py-2 px-2 text-center">
                      {getDeptName(e.departmentId)}
                    </td>
                    <td className="py-2 px-2 text-center">{e.location}</td>
                    <td className="py-2 px-2 text-center">
                      {formatDate(e.joiningDate)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      ₹{e.costPerMonth.toLocaleString()}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          e.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="py-2 px-1 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">

                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditData(e);
                              setShowEdit(true);
                            }}
                            className="hover:scale-110 transition"
                          >
                            <Edit size={16} className="text-sky-700" />
                          </button>

                          <button
                            onClick={() => deleteEmployee(e._id)}
                            className="hover:scale-110 transition"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>

                        <Link
                          to={`/employees/${e._id}?tab=skills`}
                          className="px-3 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-700 transition"
                        >
                          View Skills
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
  
            </table>
          </div>
        )}
      </div>

      {/* ---------------------- MODALS (same logic, upgraded UI) ---------------------- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg space-y-3 border border-sky-200 animate-scale-in">
            <h2 className="text-xl font-bold text-sky-800">Add Employee</h2>

            <input
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              placeholder="Name"
              onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
            />

            <input
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              placeholder="Email"
              onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
            />

            <input
              type="password"
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              placeholder="Password"
              onChange={(e) =>
                setNewEmp({ ...newEmp, password: e.target.value })
              }
            />

            <select
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              onChange={(e) =>
                setNewEmp({ ...newEmp, role: e.target.value })
              }
            >
              <option>Employee</option>
              <option>HR</option>
              <option>Admin</option>
            </select>

            <select
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              onChange={(e) =>
                setNewEmp({ ...newEmp, departmentId: e.target.value })
              }
            >
              <option value="">Choose Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              onChange={(e) =>
                setNewEmp({ ...newEmp, joiningDate: e.target.value })
              }
            />

            <input
              type="number"
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              placeholder="Cost per Month"
              onChange={(e) =>
                setNewEmp({
                  ...newEmp,
                  costPerMonth: Number(e.target.value),
                })
              }
            />

            <input
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              placeholder="Location"
              onChange={(e) =>
                setNewEmp({ ...newEmp, location: e.target.value })
              }
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                onClick={submitAdd}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && editData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg space-y-3 border border-sky-200 animate-scale-in">
            <h2 className="text-xl font-bold text-sky-800">Edit Employee</h2>

            <input
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              className="border border-sky-300 p-2 w-full mb-3 rounded"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                onClick={submitEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
