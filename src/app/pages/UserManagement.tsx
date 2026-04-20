import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { 
  Plus, Edit, Trash2, Search, Filter, Mail, 
  ShieldCheck, Wallet, Briefcase, User as UserIcon, 
  X, Check, AlertCircle, Loader2 
} from "lucide-react";
import debounce from "lodash.debounce";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function UserManagement() {
  const API = "http://localhost:5000/api/users";

  // Core State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // UI State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Manager", status: "Active" });

  /* ================= FETCH LOGIC ================= */
  const fetchUsers = async (query: string, role: string) => {
    try {
      setLoading(true);
      const res = await axios.get(API, { params: { search: query, role } });
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q: string, r: string) => fetchUsers(q, r), 400),
    []
  );

  useEffect(() => {
    debouncedFetch(search, roleFilter);
  }, [search, roleFilter, debouncedFetch]);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.patch(`${API}/${editingUser._id}`, formData);
      } else {
        await axios.post(API, formData);
      }
      closeModal();
      fetchUsers(search, roleFilter);
    } catch (err) {
      alert("Error saving user");
    }
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id: string) => {
    if (!confirm("Remove this member from the organization?")) return;
    await axios.delete(`${API}/${id}`);
    fetchUsers(search, roleFilter);
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    await axios.patch(`${API}/${user._id}`, { status: newStatus });
    setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
  };

  /* ================= UI HELPERS ================= */
  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "Manager", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      case "Finance": return <Wallet className="w-4 h-4 text-emerald-500" />;
      default: return <Briefcase className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 lg:p-12 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Organization</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your team and their access levels.</p>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-semibold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Invite Member
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-50"
          >
            <option value="">All Roles</option>
            <option>Admin</option>
            <option>Finance</option>
            <option>Manager</option>
          </select>
        </div>

        {/* USER GRID (PREMIUM CARD FORMAT) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-slate-400 font-medium">Refreshing directory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user._id} 
                className="group relative bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
                    <UserIcon className="w-7 h-7" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(user)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 leading-tight">{user.name}</h3>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1 mb-6">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full">
                    {getRoleIcon(user.role)}
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{user.role}</span>
                  </div>

                  <button 
                    onClick={() => toggleStatus(user)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      user.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {user.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && users.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No members found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* MODAL / SLIDE-OVER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingUser ? "Edit Profile" : "New Member"}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    >
                      <option>Admin</option>
                      <option>Finance</option>
                      <option>Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    {editingUser ? "Save Changes" : "Create Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}