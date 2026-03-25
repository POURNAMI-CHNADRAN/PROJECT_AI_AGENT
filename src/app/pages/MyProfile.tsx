import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  FileText,
  FolderKanban,
  Clock,
  Upload,
  ActivitySquare,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

/* ============================================================================
   FULL MyProfile.tsx — With Real Backend Integration
============================================================================ */

export default function MyProfile() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token") || "";

  const [profile, setProfile] = useState<any>(null);
  const [employeeSkills, setEmployeeSkills] = useState<any[]>([]);
  const [employeeAllocations, setEmployeeAllocations] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  /* ============================================================================
     Avatar Upload Preview Only (No API Upload Yet)
  ============================================================================ */
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((p: any) => ({ ...p, avatarPreview: url }));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /* ============================================================================
     API LOADERS
  ============================================================================ */

  const loadEmployeeSkills = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/employee-skills/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployeeSkills(data.data || []);
    } catch (err) {
      console.error("Skill Load Error", err);
    }
  };

  const loadEmployeeAllocations = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/allocations?employeeId=${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployeeAllocations(data.data || []);
    } catch (err) {
      console.error("Allocation Load Error", err);
    }
  };

  const loadTimesheets = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/timesheets/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTimesheets(data.data || []);
    } catch (err) {
      console.error("Timesheet Load Error", err);
    }
  };

  const loadPayroll = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/payroll/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayroll(data.data || null);
    } catch (err) {
      console.error("Payroll Load Error", err);
    }
  };

  const loadDocuments = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/documents/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data.data || []);
    } catch (err) {
      console.error("Documents Load Error", err);
    }
  };

  /* ============================================================================
     LOAD PROFILE + ALL EMPLOYEE MODULE DATA
  ============================================================================ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/employees/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data.data || null);

        if (data?.data?._id) {
          const empId = data.data._id;

          loadEmployeeSkills(empId);
          loadEmployeeAllocations(empId);
          loadTimesheets(empId);
          loadPayroll(empId);
          loadDocuments(empId);
        }
      } catch (err) {
        console.error("Profile Load Error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ============================================================================
     FORMATTING
  ============================================================================ */

  const formattedDate =
    profile?.joiningDate &&
    new Date(profile.joiningDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="p-6 text-sky-700 text-lg animate-fade-in">
        Loading Profile...
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-red-500 text-lg font-semibold animate-fade-in">
        Profile not Found.
      </div>
    );

  /* ============================================================================
     FULL JSX UI BELOW — MATCHES YOUR CURRENT DESIGN
  ============================================================================ */

  return (
    <div className="p-6 space-y-10 bg-sky-50">
      {/* HEADER */}
      <div className="bg-sky-200 p-8 rounded-xl shadow-lg flex items-center gap-6">

        {/* Avatar */}
        <div
          className="w-28 h-28 rounded-full bg-white shadow-xl border border-sky-200 flex items-center justify-center overflow-hidden relative group cursor-pointer"
          onClick={() => document.getElementById("avatarUpload")?.click()}
        >
          {profile.avatarPreview ? (
            <img src={profile.avatarPreview} className="w-full h-full object-cover" />
          ) : (
            <User size={54} className="text-sky-900" />
          )}

          <input type="file" id="avatarUpload" accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setProfile((p: any) => ({ ...p, avatarPreview: url }));
            }}
          />

          <div className="absolute inset-0 bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
            Change Photo
          </div>
        </div>

        {/* Name + Email */}
        <div>
          <h1 className="text-3xl font-bold text-sky-900">{profile.name}</h1>
          <p className="text-sky-700">{profile.email}</p>
        </div>

        <span
          className={`ml-auto px-4 py-1 rounded-full text-sm font-semibold ${
            profile.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {profile.status}
        </span>
      </div>

      {/* TAB NAV */}
      <div className="flex gap-6 border-b pb-3 font-medium">
        {[
          { id: "profile", label: "Profile" },
          { id: "job", label: "Job Details" },
          { id: "skills", label: "Skills" },
          { id: "projects", label: "Project Allocation" },
          { id: "attendance", label: "Timesheets" },
          { id: "payroll", label: "Payroll" },
          { id: "documents", label: "Documents" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 ${
              activeTab === tab.id
                ? "border-b-2 border-sky-600 text-sky-700 font-semibold"
                : "text-sky-700 hover:text-sky-900"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* START CONTENT */}
      <div>
        {/* PERSONAL PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
                <User size={20} /> Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3"><Mail size={18} /> <strong>{profile.email}</strong></div>
                <div className="flex gap-3"><MapPin size={18} /> {profile.location}</div>
                <div className="flex gap-3"><Calendar size={18} /> Joined: <strong>{formattedDate}</strong></div>
                <div className="flex gap-3"><Layers size={18} /> Department: <strong>{profile.departmentId?.name}</strong></div>
              </div>
            </div>

            {/* Employment Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
                <Briefcase size={20} /> Employment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3"><Briefcase size={18} /> Role: <strong>{profile.role}</strong></div>
                <div className="flex gap-3">
                  <IndianRupee size={18} /> Monthly Cost:
                  ₹{profile.costPerMonth?.toLocaleString()}
                </div>
                <div className="flex gap-3"><ActivitySquare size={18} /> Employee ID: <strong>{profile.employeeId}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* JOB TAB */}
        {activeTab === "job" && (
          <div className="bg-white p-6 rounded-xl border border-sky-200 shadow-md">
            <h3 className="text-xl font-semibold flex items-center gap-2"><Briefcase size={20}/> Job Details</h3>

            <p>Role: <strong>{profile.role}</strong></p>
            <p>Department: <strong>{profile.departmentId?.name}</strong></p>
            <p>Reporting To: <strong>Not Assigned</strong></p>
            <p>Employment Type: <strong>Full-Time</strong></p>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-sky-200">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-sky-900">
              <Sparkles className="w-6 h-6 text-sky-700" />
              Skills & Expertise
            </h3>

            {employeeSkills.length === 0 ? (
              <p>No skills assigned.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {employeeSkills.map((item) => (
                  <div key={item._id} className="bg-sky-50 p-6 rounded-xl border border-sky-200">
                    <div className="flex justify-between mb-4">
                      <span className="text-xl font-semibold text-sky-900">
                        {item.skillId?.name}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-sky-600 text-white">
                        Level {item.proficiency}
                      </span>
                    </div>

                    <div className="w-full bg-sky-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600"
                        style={{ width: `${(item.proficiency / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-3 text-sm">Category: {item.skillId?.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECT ALLOCATION TAB */}
        {activeTab === "projects" && (
          <div className="bg-white p-8 rounded-xl shadow-xl border border-sky-200">
            <h3 className="text-2xl font-semibold flex items-center gap-3 text-sky-900 mb-6">
              <FolderKanban className="w-6 h-6" /> Project Allocation Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employeeAllocations.map((item) => (
                <div key={item._id} className="bg-sky-50 p-6 rounded-xl border border-sky-200">
                  <h4 className="text-lg font-semibold">{item.project?.name}</h4>

                  <span className="text-xs px-3 py-1 rounded-full bg-sky-600 text-white">
                    {item.allocation}%
                  </span>

                  <div className="w-full bg-sky-200 h-3 rounded-full mt-2">
                    <div
                      className="h-full bg-sky-600"
                      style={{ width: `${item.allocation}%` }}
                    ></div>
                  </div>

                  <p className="mt-3 text-sm text-sky-800">Workload Allocation</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMESHEETS TAB */}
        {activeTab === "attendance" && (
          <div className="bg-white p-8 rounded-xl border border-sky-200 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-900">
              <Clock className="w-6 h-6" /> Timesheet Summary
            </h3>

            {timesheets.length === 0 ? (
              <p className="text-sky-700">No timesheet entries found.</p>
            ) : (
              <div className="space-y-4">
                {timesheets.map((entry) => (
                  <div key={entry._id} className="p-5 bg-sky-50 border border-sky-200 rounded-xl">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{entry.date}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        entry.status === "Approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="font-medium">{entry.project?.name}</p>
                        <p className="text-xs text-neutral-700">Project Name</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{entry.hours}h</p>
                        <p className="text-xs text-neutral-700">Hours Logged</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYROLL TAB */}
        {activeTab === "payroll" && (
          <div className="bg-white p-8 rounded-xl border border-sky-200 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-900">
              <DollarSign size={22} className="text-sky-700" /> Payroll Summary
            </h3>

            {payroll ? (
              <>
                <div className="bg-sky-600 text-white p-6 rounded-xl shadow-md flex justify-between">
                  <div>
                    <p className="text-sm opacity-80">Monthly Compensation</p>
                    <p className="text-3xl font-bold mt-1">
                      ₹{payroll.monthlySalary?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 opacity-40" />
                </div>
              </>
            ) : (
              <p>No payroll data available.</p>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="bg-white p-6 rounded-xl border border-sky-200 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
              <FileText size={20} /> Documents
            </h3>

            {/* UPLOAD */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                isDragActive
                  ? "bg-sky-100 border-sky-400"
                  : "bg-sky-50 border-sky-300"
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={34} className="mx-auto mb-3 text-sky-700" />
              <p>Drag & drop documents here</p>
              <p className="text-sm">PDF, PNG, DOCX</p>
            </div>

            {/* DOCUMENT LIST */}
            <div className="mt-6 space-y-3">
              {documents.length === 0 ? (
                <p>No documents uploaded.</p>
              ) : (
                documents.map((d) => (
                  <a
                    key={d._id}
                    href={d.fileUrl}
                    target="_blank"
                    className="block bg-sky-50 px-4 py-2 rounded-lg border border-sky-200"
                  >
                    {d.name}
                  </a>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}