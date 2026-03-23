import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Building2, UserCog } from "lucide-react";

interface Department {
  _id: string;
  name: string;
  managerId?: string;
}

export default function Departments() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);

  const [newDept, setNewDept] = useState({
    name: "",
    managerId: "",
  });

  const loadData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error("Department Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    const res = await fetch(`${API_BASE}/api/departments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) loadData();
  };

  // ADD
  const handleAdd = async () => {
    const payload = {
      name: newDept.name,
      managerId: newDept.managerId || null,
    };

    const res = await fetch(`${API_BASE}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowAdd(false);
      loadData();
    }
  };

  // EDIT
  const handleEdit = async () => {
    if (!editDept) return;

    const res = await fetch(`${API_BASE}/api/departments/${editDept._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editDept),
    });

    if (res.ok) {
      setShowEdit(false);
      loadData();
    }
  };

  return (
    <div className="p-6 w-full space-y-10 bg-sky-50">

      {/* HEADER */}
      <div className="bg-sky-200 p-7 rounded-xl shadow text-sky-900 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow border border-sky-100">
            <Building2 size={28} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Departments</h1>
            <p className="text-sky-700 text-sm">
              Manage departments & department heads
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-sky-200 p-4 animate-fade-in">

        <table className="w-full text-sm whitespace-nowrap table-fixed">
          <thead>
            <tr className="bg-sky-100 text-sky-800 font-semibold">
              <th className="py-2 px-2 text-center">Department</th>
              <th className="py-2 px-2 text-center">Manager</th>
              <th className="py-2 px-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="py-6 text-center text-sky-700">Loading...</td></tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-16 text-center text-sky-700">
                  https://illustrations.popsy.co/purple/folder.svg
                  <p className="mt-2">No Departments Found</p>
                </td>
              </tr>
            ) : (
              departments.map((dept, index) => (
              <tr
              key={dept._id}
              className="border-b hover:bg-sky-50 transition transform hover:scale-[1.01]"
              style={{ animation: `fadeIn .3s ease ${index * 0.05}s both` }}
            >
              {/* Department Name */}
              <td className="py-2 px-2 font-medium text-center align-middle">
                {dept.name}
              </td>

              {/* Manager Column */}
              <td className="py-2 px-2 text-center align-middle">
                <div className="flex items-center justify-center gap-2">
                  <UserCog size={16} className="text-sky-800" />
                  <span>
                    {dept.managerId || "Not Assigned"}
                  </span>
                </div>
              </td>

              {/* Actions Column */}
              <td className="py-2 px-2 text-center align-middle">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditDept(dept);
                      setShowEdit(true);
                    }}
                    className="hover:scale-110 transition"
                  >
                    <Edit size={16} className="text-sky-700" />
                  </button>

                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="hover:scale-110 transition"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

      {/* ADD DEPARTMENT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow space-y-4 border border-sky-200 animate-scale-in">
            
            <h2 className="text-xl font-bold text-sky-900">Add Department</h2>

            <input
              className="border border-sky-300 p-2 w-full rounded"
              placeholder="Department Name"
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
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
                onClick={handleAdd}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && editDept && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow space-y-4 border border-sky-200 animate-scale-in">

            <h2 className="text-xl font-bold text-sky-900">Edit Department</h2>

            <input
              className="border border-sky-300 p-2 w-full rounded"
              value={editDept.name}
              onChange={(e) => setEditDept({ ...editDept, name: e.target.value })}
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
                onClick={handleEdit}
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

