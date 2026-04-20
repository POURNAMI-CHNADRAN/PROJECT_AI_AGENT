import React, { useEffect, useMemo, useState } from "react";
import { 
  User, Mail, MapPin, Calendar, Upload, DollarSign, 
  Briefcase, Award, FileText, ChevronRight, ExternalLink 
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

type AnyObj = Record<string, any>;

export default function MyProfile() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  /* ===================================================
      AUTH & STATE
  =================================================== */
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token") || savedUser?.token || "";

  const [profile, setProfile] = useState<AnyObj | null>(null);
  const [data, setData] = useState({
    skills: [] as any[],
    allocations: [] as any[],
    timesheets: [] as any[],
    documents: [] as any[],
    payroll: null as any,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  /* ===================================================
      HELPERS
  =================================================== */
  const fetcher = async (url: string) => {
    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }
    const json = await res.json();
    return json?.data ?? json;
  };

  const isEmployee = useMemo(() => (
    profile?.employeeCode || profile?.hourlyCost || profile?.joiningDate
  ), [profile]);

  /* ===================================================
      LOADER LOGIC
  =================================================== */
  useEffect(() => {
    const init = async () => {
      if (!token) { setError("Session expired. Please login again."); setLoading(false); return; }
      try {
        setLoading(true);
        const me = await fetcher(`${API_BASE}/api/employees/me`);
        setProfile(me);

        // Batch secondary requests
        if (me?._id) {
          const [skills, allocations, timesheets, payroll, docs] = await Promise.allSettled([
            fetcher(`${API_BASE}/api/employee-skills/${me._id}`),
            fetcher(`${API_BASE}/api/employees/me/allocations`),
            fetcher(`${API_BASE}/api/timesheets/employee/${me._id}`),
            fetcher(`${API_BASE}/api/payroll/${me._id}`),
            fetcher(`${API_BASE}/api/documents/${me._id}`),
          ]);

          setData({
            skills: skills.status === 'fulfilled' ? (Array.isArray(skills.value) ? skills.value : []) : [],
            allocations: allocations.status === 'fulfilled' ? (Array.isArray(allocations.value) ? allocations.value : []) : [],
            timesheets: timesheets.status === 'fulfilled' ? (Array.isArray(timesheets.value) ? timesheets.value : []) : [],
            payroll: payroll.status === 'fulfilled' ? payroll.value : null,
            documents: docs.status === 'fulfilled' ? (Array.isArray(docs.value) ? docs.value : []) : [],
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  /* ===================================================
      RENDER HELPERS
  =================================================== */
  const tabs = [
    { id: "profile", label: "Overview", icon: <User size={18}/> },
    ...(isEmployee ? [
      { id: "skills", label: "Skills", icon: <Award size={18}/> },
      { id: "projects", label: "Projects", icon: <Briefcase size={18}/> },
      { id: "attendance", label: "Timesheets", icon: <Calendar size={18}/> },
      { id: "payroll", label: "Payroll", icon: <DollarSign size={18}/> },
      { id: "documents", label: "Documents", icon: <FileText size={18}/> },
    ] : []),
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-slate-900">
      {/* PREMIUM HEADER */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative">
        <div className="max-w-6xl mx-auto px-6 relative h-full">
          <div className="absolute -bottom-16 left-6 flex items-end gap-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl ring-4 ring-white/20 overflow-hidden">
              {profile?.avatarPreview ? (
                <img src={profile.avatarPreview} className="w-full h-full object-cover rounded-[1.2rem]" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-blue-600">
                  <User size={60} />
                </div>
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-amber-800 tracking-tight">{profile?.name}</h1>
              <p className="text-amber-800 flex items-center gap-2">
                <Briefcase size={16}/> {profile?.role || "Team Member"} • {profile?.employeeCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm font-semibold" 
                  : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className={`${activeTab === tab.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 text-slate-800">Contact Details</h3>
                    <div className="space-y-4">
                      <DetailRow icon={<Mail size={18}/>} label="Email" value={profile?.email} />
                      <DetailRow icon={<MapPin size={18}/>} label="Work Location" value={profile?.location} />
                      <DetailRow icon={<Calendar size={18}/>} label="Joined Date" value={profile?.joiningDate} isDate />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 text-slate-800">Professional Identity</h3>
                    <div className="space-y-4">
                      <DetailRow label="Employee ID" value={profile?.employeeCode} />
                      <DetailRow label="Status" value={profile?.status || "Active"} isStatus />
                      {isEmployee && <DetailRow label="Hourly Rate" value={`₹${profile?.hourlyCost}`} />}
                    </div>
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === "skills" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Skill</span>
                      <h4 className="text-lg font-bold text-slate-800 mb-3">{item.skillId?.name}</h4>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(item.proficiency/5)*100}%` }} />
                      </div>
                      <span className="text-sm mt-2 text-slate-600 font-medium">Level {item.proficiency} / 5</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PAYROLL TAB */}
              {activeTab === "payroll" && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <DollarSign size={200} />
                  </div>
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-6">Financial Overview</h3>
                    {data.payroll ? (
                      <div className="bg-slate-900 rounded-2xl p-8 text-white flex justify-between items-center">
                        <div>
                          <p className="text-slate-400 font-medium mb-1">Monthly Gross Salary</p>
                          <h2 className="text-4xl font-black">₹{Number(data.payroll.monthlySalary).toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center">
                          <DollarSign className="text-blue-400" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400">No payroll records found for the current period.</div>
                    )}
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.documents.map((doc, i) => (
                      <a key={i} href={doc.fileUrl} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                            <FileText size={20}/>
                          </div>
                          <span className="font-semibold text-slate-700">{doc.name || "Untitled Document"}</span>
                        </div>
                        <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors"/>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMESHEET TAB */}
              {activeTab === "attendance" && (
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Project</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.timesheets.map((ts, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-700">{ts.project_id?.name || "General"}</td>
                            <td className="px-6 py-4 text-slate-500">{ts.work_date?.split('T')[0]}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ts.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {ts.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ===================================================
    COMPONENTS
=================================================== */
function DetailRow({ icon, label, value, isDate, isStatus }: any) {
  const displayValue = isDate && value ? new Date(value).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric'}) : (value || "-");
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-slate-500">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {isStatus ? (
        <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-xs font-bold ring-1 ring-emerald-100">{displayValue}</span>
      ) : (
        <span className="text-sm font-bold text-slate-700">{displayValue}</span>
      )}
    </div>
  );
}