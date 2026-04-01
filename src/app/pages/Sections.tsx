import React, { useEffect, useState } from "react";
import { Plus, Trash2, Building2, Layers } from "lucide-react";

/* ================= TYPES ================= */

interface Department {
  _id: string;
  name: string;
}

interface WorkCategory {
  _id: string;
  name: string;
}

interface MasterSectionProps<T extends { _id: string; name: string }> {
  title: string;
  icon: React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  loading: boolean;
  items: T[];
  onDelete: (id: string) => void;
}

/* ================= MAIN ================= */

export default function Sections() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddWC, setShowAddWC] = useState(false);

  const [newDeptName, setNewDeptName] = useState("");
  const [newWCName, setNewWCName] = useState("");

  /* ================= LOAD ================= */

  const loadData = async () => {
    try {
      const [deptRes, wcRes] = await Promise.all([
        fetch(`${API_BASE}/api/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/workcategories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDepartments(await deptRes.json());
      setWorkCategories(await wcRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTIONS ================= */

  const addWorkCategory = async () => {
    await fetch(`${API_BASE}/api/workcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newWCName }),
    });
    setShowAddWC(false);
    setNewWCName("");
    loadData();
  };

  const deleteWorkCategory = async (id: string) => {
    if (!confirm("Delete this Work Category?")) return;
    await fetch(`${API_BASE}/api/workcategories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  const addDepartment = async () => {
    await fetch(`${API_BASE}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newDeptName }),
    });
    setShowAddDept(false);
    setNewDeptName("");
    loadData();
  };

  const deleteDepartment = async (id: string) => {
    if (!confirm("Delete this Department?")) return;
    await fetch(`${API_BASE}/api/departments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  return (
    <div className="p-6 space-y-14 bg-sky-50">

      {/* ================= WORK CATEGORIES ================= */}
      <MasterSection<WorkCategory>
        title="Work Categories"
        icon={<Layers size={20} className="text-sky-700" />}
        addLabel="Add Work Category"
        onAdd={() => setShowAddWC(true)}
        loading={loading}
        items={workCategories}
        onDelete={deleteWorkCategory}
      />

      {/* ================= DEPARTMENTS ================= */}
      <MasterSection<Department>
        title="Departments"
        icon={<Building2 size={20} className="text-sky-700" />}
        addLabel="Add Department"
        onAdd={() => setShowAddDept(true)}
        loading={loading}
        items={departments}
        onDelete={deleteDepartment}
      />

      {/* ================= MODALS ================= */}

      {showAddWC && (
        <Modal title="Add Work Category">
          <input
            className="border border-sky-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-sky-300 outline-none"
            placeholder="Work Category Name"
            value={newWCName}
            onChange={(e) => setNewWCName(e.target.value)}
          />
          <ModalActions
            onSave={addWorkCategory}
            onCancel={() => setShowAddWC(false)}
          />
        </Modal>
      )}

      {showAddDept && (
        <Modal title="Add Department">
          <input
            className="border border-sky-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-sky-300 outline-none"
            placeholder="Department Name"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />
          <ModalActions
            onSave={addDepartment}
            onCancel={() => setShowAddDept(false)}
          />
        </Modal>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MasterSection<T extends { _id: string; name: string }>({
  title,
  icon,
  addLabel,
  onAdd,
  loading,
  items,
  onDelete,
}: MasterSectionProps<T>) {
  return (
    <div className="bg-white border border-sky-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-sky-100">
        <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-sky-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-sky-700 transition"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="text-sky-700 bg-sky-50">
            <th className="px-6 py-2 text-left w-[80%]">Name</th>
            <th className="px-4 py-2 text-center w-[20%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="py-6 text-center text-sky-600">
                Loading...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-10 text-center text-sky-500">
                No records available
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-sky-50 transition"
              >
                <td className="px-6 py-3 font-medium text-sky-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-center">
                  <Trash2
                    size={16}
                    className="mx-auto text-red-500 hover:text-red-600 cursor-pointer transition"
                    onClick={() => onDelete(item._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Modal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-sky-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 text-sm rounded bg-sky-600 text-white hover:bg-sky-700"
      >
        Save
      </button>
    </div>
  );
}
