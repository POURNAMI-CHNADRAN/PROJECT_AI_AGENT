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
  allowedBillingTypes: ("Billable" | "Non-Billable")[];
  status: "Active" | "Inactive";
}

interface MasterSectionProps<T extends { _id: string; name: string }> {
  title: string;
  icon: React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  loading: boolean;
  items: T[];
  onDelete: (id: string) => void;

  /** ✅ Only for Work Categories */
  showBillingTypes?: boolean;
}

/* ================= MAIN ================= */

export default function Segmentations() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddWC, setShowAddWC] = useState(false);

  const [newDeptName, setNewDeptName] = useState("");
  const [newWCName, setNewWCName] = useState("");
  const [billingTypes, setBillingTypes] = useState<string[]>([]);

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

      const deptJson = await deptRes.json();
      const wcJson = await wcRes.json();

      setDepartments(
        Array.isArray(deptJson) ? deptJson : deptJson.data ?? []
      );

      setWorkCategories(
        Array.isArray(wcJson) ? wcJson : wcJson.data ?? []
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTIONS ================= */

  const addWorkCategory = async () => {
    if (!newWCName || billingTypes.length === 0) {
      alert("Please enter name and select at least one billing type");
      return;
    }

    await fetch(`${API_BASE}/api/workcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newWCName,
        allowedBillingTypes: billingTypes,
        status: "Active",
      }),
    });

    setNewWCName("");
    setBillingTypes([]);
    setShowAddWC(false);
    loadData();
  };

  const deleteWorkCategory = async (id: string) => {
    if (!window.confirm("Delete this Work Category?")) return;
    await fetch(`${API_BASE}/api/workcategories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  const addDepartment = async () => {
    if (!newDeptName.trim()) return;
    await fetch(`${API_BASE}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newDeptName }),
    });
    setNewDeptName("");
    setShowAddDept(false);
    loadData();
  };

  const deleteDepartment = async (id: string) => {
    if (!window.confirm("Delete this Department?")) return;
    await fetch(`${API_BASE}/api/departments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  return (
    <div className="p-6 space-y-14 bg-sky-50">

      {/* WORK CATEGORIES */}
      <MasterSection<WorkCategory>
        title="Work Categories"
        icon={<Layers size={20} className="text-sky-700" />}
        addLabel="Add Work Category"
        onAdd={() => setShowAddWC(true)}
        loading={loading}
        items={workCategories}
        onDelete={deleteWorkCategory}
        showBillingTypes
      />

      {/* DEPARTMENTS */}
      <MasterSection<Department>
        title="Departments"
        icon={<Building2 size={20} className="text-sky-700" />}
        addLabel="Add Department"
        onAdd={() => setShowAddDept(true)}
        loading={loading}
        items={departments}
        onDelete={deleteDepartment}
      />

      {/* ADD WORK CATEGORY MODAL */}
      {showAddWC && (
        <Modal title="Add Work Category">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-sky-900">
              Work Category Name
            </label>
            <input
              className="border border-sky-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-sky-300"
              value={newWCName}
              onChange={(e) => setNewWCName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-sky-900">
              Billing Types
            </label>
            <div className="flex gap-3">
              {["Billable", "Non-Billable"].map((type) => {
                const selected = billingTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setBillingTypes((prev) =>
                        selected
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition
                      ${
                        selected
                          ? type === "Billable"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <ModalActions
            onSave={addWorkCategory}
            onCancel={() => setShowAddWC(false)}
          />
        </Modal>
      )}

      {/* ADD DEPARTMENT MODAL */}
      {showAddDept && (
        <Modal title="Add Department">
          <input
            className="border border-sky-300 px-3 py-2 rounded w-full"
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

/* ================= MASTER TABLE ================= */

function MasterSection<T extends { _id: string; name: string }>({
  title,
  icon,
  addLabel,
  onAdd,
  loading,
  items,
  onDelete,
  showBillingTypes = false,
}: MasterSectionProps<T>) {
  const colSpan = showBillingTypes ? 3 : 2;

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 bg-sky-100">
        <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <button
          onClick={onAdd}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-sky-700">
            <th className="px-6 py-2 text-left">Name</th>
            {showBillingTypes && (
              <th className="px-6 py-2 text-left">Billing Types</th>
            )}
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="p-6 text-center">Loading...</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="p-6 text-center">No Records</td>
            </tr>
          ) : (
            items.map((item: any) => (
              <tr key={item._id} className="border-t hover:bg-sky-50">
                <td className="px-6 py-3 font-medium text-sky-900">
                  {item.name}
                </td>

                {showBillingTypes && (
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {item.allowedBillingTypes.map((type: string) => (
                        <span
                          key={type}
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              type === "Billable"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                )}

                <td className="px-4 py-3 text-center">
                  <Trash2
                    size={16}
                    className="text-red-500 cursor-pointer hover:text-red-600 mx-auto"
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

/* ================= MODALS ================= */

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
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
      <button onClick={onCancel} className="border px-4 py-2 rounded">
        Cancel
      </button>
      <button onClick={onSave} className="bg-sky-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}