import { Plus, Edit, Trash2 } from "lucide-react";

const users = [
  { name: "Alice Cooper", email: "alice@company.com", role: "Admin", status: "Active" },
  { name: "Bob Martinez", email: "bob@company.com", role: "Finance", status: "Active" },
  { name: "Carol Williams", email: "carol@company.com", role: "Manager", status: "Active" },
  { name: "David Brown", email: "david@company.com", role: "HR", status: "Active" },
  { name: "Emma Davis", email: "emma@company.com", role: "Manager", status: "Inactive" },
];

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-neutral-800">User Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* User Roles Info */}
      <div className="bg-white border-2 border-neutral-300 p-6 rounded">
        <h3 className="text-neutral-800 mb-3">User Roles</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-neutral-50 border border-neutral-200 rounded">
            <div className="text-2xl mb-2">👑</div>
            <p className="text-sm text-neutral-800">Admin</p>
            <p className="text-xs text-neutral-600 mt-1">Full access</p>
          </div>
          <div className="text-center p-4 bg-neutral-50 border border-neutral-200 rounded">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm text-neutral-800">Finance</p>
            <p className="text-xs text-neutral-600 mt-1">Billing & reports</p>
          </div>
          <div className="text-center p-4 bg-neutral-50 border border-neutral-200 rounded">
            <div className="text-2xl mb-2">👔</div>
            <p className="text-sm text-neutral-800">Manager</p>
            <p className="text-xs text-neutral-600 mt-1">Resource allocation</p>
          </div>
          <div className="text-center p-4 bg-neutral-50 border border-neutral-200 rounded">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm text-neutral-800">HR</p>
            <p className="text-xs text-neutral-600 mt-1">Employee management</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Name</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Email</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Role</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Status</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{user.name}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{user.email}</td>
                <td className="px-6 py-3 text-sm">
                  <span className="px-2 py-1 bg-neutral-200 text-neutral-800 rounded text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.status === 'Active' 
                      ? 'bg-neutral-200 text-neutral-800' 
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Edit className="w-4 h-4 text-neutral-600" />
                    </button>
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Trash2 className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
