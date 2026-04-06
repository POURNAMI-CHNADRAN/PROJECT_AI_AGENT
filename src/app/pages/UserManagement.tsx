import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2 } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function UserManagement() {
  const API = "http://localhost:5000/api/users";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        params: {
          search,
          role: roleFilter,
        },
      });

      // ✅ SAFE FALLBACK
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setUsers([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  /* ================= DELETE ================= */
  const deleteUser = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (user: User) => {
    await axios.patch(`${API}/${user._id}`, {
      status: user.status === "Active" ? "Inactive" : "Active",
    });

    fetchUsers();
  };

  return (
    <div className="space-y-6 p-6 bg-sky-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-sky-900 text-2xl font-semibold">
          User Management
        </h1>

        <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-sky-200 p-2 rounded w-64 focus:ring-2 focus:ring-sky-300 outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-sky-200 p-2 rounded focus:ring-2 focus:ring-sky-300"
        >
          <option value="">All Roles</option>
          <option>Admin</option>
          <option>Finance</option>
          <option>Manager</option>
          <option>Finance</option>
        </select>
      </div>

      {/* ROLE CARDS */}
      <div className="bg-white border border-sky-200 p-6 rounded-lg">
        <h3 className="text-sky-900 mb-4 font-medium">User Roles</h3>

        <div className="grid grid-cols-4 gap-4">
          {[
            { role: "Admin", icon: "👑", desc: "Full Access" },
            { role: "Finance", icon: "💰", desc: "Billing & Reports" },
            { role: "Manager", icon: "👔", desc: "Resource Allocation" },
            { role: "Finance", icon: "👥", desc: "Employee Management" },
          ].map((r) => (
            <div
              key={r.role}
              className="text-center p-4 bg-sky-50 border border-sky-200 rounded"
            >
              <div className="text-2xl mb-2">{r.icon}</div>
              <p className="text-sm text-sky-900">{r.role}</p>
              <p className="text-xs text-sky-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-sky-200 rounded overflow-hidden">
        {loading ? (
          <p className="p-6 text-sky-700">Loading Users...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-gray-500">No Users Found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-sky-100 border-b border-sky-200">
                <th className="text-left px-6 py-3 text-sm text-sky-800">Name</th>
                <th className="text-left px-6 py-3 text-sm text-sky-800">Email</th>
                <th className="text-left px-6 py-3 text-sm text-sky-800">Role</th>
                <th className="text-left px-6 py-3 text-sm text-sky-800">Status</th>
                <th className="text-left px-6 py-3 text-sm text-sky-800">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-sky-100 hover:bg-sky-50"
                >
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-3 text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-3 text-sm">
                    <span className="px-2 py-1 bg-sky-200 text-sky-900 rounded text-xs">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-sm">
                    <span
                      onClick={() => toggleStatus(user)}
                      className={`px-2 py-1 rounded text-xs cursor-pointer ${
                        user.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-sm">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-sky-100 rounded">
                        <Edit className="w-4 h-4 text-sky-600" />
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}