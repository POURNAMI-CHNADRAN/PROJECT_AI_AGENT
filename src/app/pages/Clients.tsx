import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building2,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { JSX } from "react/jsx-runtime";

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */

interface ClientType {
  _id: string;
  client_name: string;
  industry: string;
  country: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt?: string;
}

interface ClientFormProps {
  title: string;
  data: ClientType;
  setData: (data: ClientType) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface ClientCardProps {
  client: ClientType;
  userRole: string;
  setEditData: (data: ClientType) => void;
  setShowEdit: (show: boolean) => void;
  deleteClient: (id: string) => void;
}

interface KPIProps {
  value: number | string;
  label: string;
  icon: JSX.Element;
  color: "sky" | "green" | "orange" | "purple" | "pink" | "yellow";
}

interface DetailProps {
  icon: JSX.Element;
  label: string;
  value: string | number | null | undefined;
}

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */

export default function Clients() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token") || "";
  const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<ClientType | null>(null);

  const emptyClient: ClientType = {
    _id: "",
    client_name: "",
    industry: "",
    country: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  };

  const [newClient, setNewClient] = useState<ClientType>(emptyClient);

  /* -------------------- LOAD CLIENTS -------------------- */
  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data.data || []);
    } catch (err) {
      console.log("Client Load Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter((c) =>
    c.client_name.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- KPI CALCULATIONS -------------------- */
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.isActive).length;

  const industriesCount = new Set(clients.map((c) => c.industry).filter(Boolean))
    .size;

  const countriesCount = new Set(clients.map((c) => c.country).filter(Boolean))
    .size;

  const clientsThisMonth = clients.filter((c) => {
    if (!c.createdAt) return false;
    const created = new Date(c.createdAt);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const industryMap: Record<string, number> = {};
  clients.forEach((c) => {
    if (c.industry) {
      industryMap[c.industry] = (industryMap[c.industry] || 0) + 1;
    }
  });

  const topIndustry =
    Object.entries(industryMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  /* -------------------- CREATE CLIENT -------------------- */
  const handleAddClient = async () => {
    const res = await fetch(`${API_BASE}/api/clients`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClient),
    });

    if (!res.ok) return alert("Failed to create client");
    setShowAdd(false);
    loadClients();
  };

  /* -------------------- UPDATE CLIENT -------------------- */
  const handleEditClient = async () => {
    if (!editData) return;

    const res = await fetch(`${API_BASE}/api/clients/${editData._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) return alert("Failed to update client");

    setShowEdit(false);
    loadClients();
  };

  /* -------------------- DELETE CLIENT -------------------- */
  const deleteClient = async (id: string) => {
    if (!confirm("Archive this client?")) return;

    const res = await fetch(`${API_BASE}/api/clients/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadClients();
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6 w-full space-y-10 bg-sky-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-300 to-sky-200 p-8 rounded-2xl shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow">
            <Building2 size={32} className="text-sky-700" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-sky-900">Client Management</h1>
            <p className="text-sky-700 text-sm">Organize your customers, partners & businesses</p>
          </div>
        </div>

        {(userRole === "Admin" || userRole === "HR") && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-sky-700 text-white px-5 py-2.5 rounded-xl shadow hover:bg-sky-800 hover:scale-105 transition"
          >
            <Plus size={18} /> Add Client
          </button>
        )}
      </div>

      {/* INSIGHTS PANEL - CENTERED KPIs */}
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-sky-200 p-10 flex flex-col items-center">

        <h2 className="text-3xl font-extrabold text-sky-900 mb-10 flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-sky-700" />
          Client Insights
        </h2>

        {/* CENTERED 2-COLUMN KPI GRID */}
        <div
          className="
            grid 
            gap-8 
            place-items-center 
            mx-auto
            w-full
            max-w-[900px]
            grid-cols-1
            sm:grid-cols-2
          "
        >
          <KPI value={totalClients} label="Total Clients" icon={<Building2 size={30} />} color="sky" />
          <KPI value={activeClients} label="Active Clients" icon={<Briefcase size={30} />} color="green" />
          <KPI value={industriesCount} label="Industries" icon={<Globe2 size={30} />} color="orange" />
          <KPI value={countriesCount} label="Countries" icon={<MapPin size={30} />} color="purple" />
          <KPI value={clientsThisMonth} label="Added This Month" icon={<Plus size={30} />} color="pink" />
          <KPI value={topIndustry} label="Top Industry" icon={<Briefcase size={30} />} color="yellow" />
        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow border border-sky-200 flex items-center gap-3 w-full sm:w-80 mx-auto">
        <Search className="text-sky-700" size={18} />
        <input
          type="text"
          className="outline-none w-full"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CLIENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-sky-700">Loading...</p>
        ) : filteredClients.length === 0 ? (
          <p className="text-sky-700">No clients found</p>
        ) : (
          filteredClients.map((client) => (
            <ClientCard
              key={client._id}
              client={client}
              userRole={userRole}
              setEditData={setEditData}
              setShowEdit={setShowEdit}
              deleteClient={deleteClient}
            />
          ))
        )}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal>
          <ClientForm
            title="Add Client"
            data={newClient}
            setData={setNewClient}
            onSave={handleAddClient}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && editData && (
        <Modal>
          <ClientForm
            title="Edit Client"
            data={editData}
            setData={setEditData}
            onSave={handleEditClient}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      )}

    </div>
  );
}

/* ---------------------------------------------------------
   COMPONENTS
--------------------------------------------------------- */

function KPI({ value, label, icon, color }: KPIProps) {
  const bg = {
    sky: "from-sky-50 to-sky-100 border-sky-200",
    green: "from-green-50 to-green-100 border-green-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
    pink: "from-pink-50 to-pink-100 border-pink-200",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200",
  };

  const iconBg = {
    sky: "bg-sky-600",
    green: "bg-green-600",
    orange: "bg-orange-500",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
    yellow: "bg-yellow-500",
  };

  return (
    <div
      className={`
      bg-gradient-to-br ${bg[color]}
      p-7 rounded-2xl shadow-md border 
      w-full max-w-md flex items-center gap-5
    `}
    >
      <div
        className={`${iconBg[color]} text-white w-14 h-14 rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold text-sky-900">{label}</p>
        <p className="text-4xl font-extrabold text-sky-900">{value}</p>
      </div>
    </div>
  );
}

function ClientCard({
  client,
  userRole,
  setEditData,
  setShowEdit,
  deleteClient,
}: ClientCardProps) {
  return (
    <div className="bg-white p-7 rounded-2xl shadow-xl border border-sky-200 hover:shadow-2xl hover:scale-[1.02] transition-all">
      <h2 className="text-2xl font-semibold text-sky-900 flex items-center gap-2 mb-4">
        <Briefcase size={20} className="text-sky-700" />
        {client.client_name}
      </h2>

      <Detail icon={<Building2 size={18} className="text-sky-600" />} label="Industry" value={client.industry} />
      <Detail icon={<Globe2 size={18} className="text-sky-600" />} label="Country" value={client.country} />
      <Detail icon={<Mail size={18} className="text-sky-600" />} label="Email" value={client.email} />
      <Detail icon={<Phone size={18} className="text-sky-600" />} label="Phone" value={client.phone} />
      <Detail icon={<MapPin size={18} className="text-sky-600" />} label="Address" value={client.address} />

      {(userRole === "Admin" || userRole === "HR") && (
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => {
              setEditData(client);
              setShowEdit(true);
            }}
            className="hover:scale-110 transition"
          >
            <Edit size={20} className="text-sky-700" />
          </button>

          <button
            onClick={() => deleteClient(client._id)}
            className="hover:scale-110 transition"
          >
            <Trash2 size={20} className="text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value }: DetailProps) {
  return (
    <p className="flex items-center gap-2 text-sky-800 mb-1">
      {icon}
      <strong>{label}:</strong> {value || "N/A"}
    </p>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      {children}
    </div>
  );
}

function ClientForm({
  title,
  data,
  setData,
  onSave,
  onCancel,
}: ClientFormProps) {
  return (
    <div className="bg-white p-8 rounded-xl w-[450px] shadow-xl border border-sky-200 space-y-4">
      <h2 className="text-2xl font-bold text-sky-900">{title}</h2>

      {["client_name", "industry", "country", "email", "phone", "address"].map(
        (field) => (
          <input
            key={field}
            value={(data as any)[field] || ""}
            onChange={(e) =>
              setData({ ...data, [field]: e.target.value } as ClientType)
            }
            className="border border-sky-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder={field.replace("_", " ").toUpperCase()}
          />
        )
      )}

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-200 rounded-xl" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-sky-600 text-white rounded-xl"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}