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
  ArrowLeft,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function MyProfile() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [employeeSkills, setEmployeeSkills] = useState<any[]>([]);

  /** Mock Data (from EmployeeProfile) */
  const skills = [
    { name: "React", proficiency: "Expert" },
    { name: "Typescript", proficiency: "Advanced" },
    { name: "Node.js", proficiency: "Intermediate" },
    { name: "AWS", proficiency: "Intermediate" },
  ];

  const allocations = [
    { project: "E-commerce Platform", allocation: "60%" },
    { project: "Mobile App Redesign", allocation: "40%" },
  ];

  const timesheets = [
    { date: "2026-03-15", project: "E-commerce Platform", hours: "8h", status: "Approved" },
    { date: "2026-03-14", project: "Mobile App Redesign", hours: "6h", status: "Approved" },
    { date: "2026-03-13", project: "E-commerce Platform", hours: "8h", status: "Pending" },
  ];

  /** Avatar Upload */
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev: any) => ({ ...prev, avatarPreview: url }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /** Load Profile */
  useEffect(() => {
    fetch(`${API_BASE}/api/employees/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.data || null);

        
      if (data?.data?._id) {
        fetch(`${API_BASE}/api/employee-skills/${data.data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((S) => setEmployeeSkills(S.data || []));
      }

      setLoading(false);
    });
}, []);

  
  const formattedDate =
    profile?.joiningDate &&
    new Date(profile.joiningDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading)
    return <div className="p-6 text-sky-700 text-lg animate-fade-in">Loading Profile...</div>;

  if (!profile)
    return (
      <div className="p-6 text-red-500 text-lg font-semibold animate-fade-in">
        Profile not Found.
      </div>
    );

  return (
    <div className="p-6 space-y-10 bg-sky-50">

      {/* HEADER CARD */}
      <div className="bg-sky-200 p-8 rounded-xl shadow-lg flex items-center gap-6 animate-fade-slide-down">

        {/* Editable Avatar */}
        <div
          className="w-28 h-28 rounded-full bg-white shadow-xl border border-sky-200 flex items-center justify-center overflow-hidden relative group cursor-pointer"
          onClick={() => document.getElementById("avatarUpload")?.click()}
        >
          {profile.avatarPreview ? (
            <img
              src={profile.avatarPreview}
              className="w-full h-full object-cover group-hover:opacity-60 transition"
            />
          ) : (
            <User size={54} className="text-sky-900 group-hover:opacity-60 transition" />
          )}

          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setProfile((prev: any) => ({ ...prev, avatarPreview: url }));
            }}
          />

          <div className="absolute inset-0 bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full backdrop-blur-sm">
            Change Photo
          </div>
        </div>

        {/* Basic Info */}
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


      {/* TAB NAVIGATION */}
      <div className="flex gap-6 border-b pb-3 font-medium animate-fade-in">
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
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-sky-600 text-sky-700 font-semibold"
                : "text-sky-700 hover:text-sky-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* CONTENT AREA */}
      <div className="animate-fade-in">

        {/* TAB: PROFILE */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
                <User size={20} /> Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3"><Mail size={18} /> {profile.email}</div>
                <div className="flex items-center gap-3"><MapPin size={18} /> {profile.location}</div>

                <div className="flex items-center gap-3">
                  <Calendar size={18} />
                  Joined: <span className="font-medium">{formattedDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Layers size={18} />
                  Department: <span className="font-medium">{profile.departmentId?.name}</span>
                </div>
              </div>
            </div>


            {/* Employment Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
                <Briefcase size={20} /> Employment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3"><Briefcase size={18} /> Role:  
                  <span className="font-medium">{profile.role}</span>
                </div>

                <div className="flex items-center gap-3"><IndianRupee size={18} /> Monthly Cost:
                  <span className="font-medium">₹{profile.costPerMonth?.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3"><ActivitySquare size={18} /> 
                  Employee ID: <span className="font-medium">{profile.employeeId}</span>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* TAB: JOB */}
        {activeTab === "job" && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200 text-sky-900 space-y-3 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold flex items-center gap-2"><Briefcase size={20}/> Job Details</h3>

            <p className="text-black">Role: <strong>{profile.role}</strong></p>
            <p className="text-black">Department: <strong>{profile.departmentId?.name}</strong></p>
            <p className="text-black">Reporting To: <strong>Not Assigned</strong></p>
            <p className="text-black">Employment Type: <strong>Full-Time</strong></p>
          </div>
        )}


        {/* TAB: SKILLS */}
        {activeTab === "skills" && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-sky-200 
              hover:shadow-2xl transition duration-300">

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-sky-900">
              <Sparkles className="w-6 h-6 text-sky-700" />
              Skills & Expertise
            </h3>

            {employeeSkills.length === 0 ? (
              <p className="text-neutral-600">No skills assigned.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {employeeSkills.map((item) => (
                  <div
                    key={item._id}
                    className="
                      group relative p-6 rounded-xl border border-sky-200 bg-gradient-to-br 
                      from-white to-sky-50/70 shadow-sm hover:shadow-xl hover:scale-[1.02]
                      transition-all duration-300 backdrop-blur-sm
                    "
                  >
                    {/* Skill Name + Proficiency */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold text-sky-900">
                        {item.skillId?.name}
                      </span>

                      <span
                        className="
                          text-xs px-3 py-1 rounded-full
                          bg-gradient-to-r from-sky-500 to-sky-700 text-white shadow-md
                        "
                      >
                        Level {item.proficiency}
                      </span>
                    </div>

                    {/* Animated Proficiency Bar */}
                    <div className="w-full bg-sky-200/50 h-3 rounded-full overflow-hidden">
                      <div
                        className="
                          h-full bg-sky-600 rounded-full 
                          transition-all duration-700 group-hover:bg-sky-700
                        "
                        style={{
                          width: `${(item.proficiency / 5) * 100}%`
                        }}
                      ></div>
                    </div>

                    <p className="mt-3 text-sm text-sky-800 font-medium">
                      Category: {item.skillId?.category}
                    </p>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}

        {/* TAB: PROJECT ALLOCATION */}
        {activeTab === "projects" && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-200 hover:shadow-xl transition duration-300">

            {/* Header */}
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-900">
              <FolderKanban className="w-6 h-6 text-sky-700" />
              Project Allocation Overview
            </h3>

            {/* Allocation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allocations.map((row) => (
                <div
                  key={row.project}
                  className="
                    group bg-sky-50/70 p-6 rounded-xl border border-sky-200 shadow-sm 
                    hover:shadow-lg hover:bg-sky-100/80 
                    transition-all duration-300 backdrop-blur-sm cursor-pointer
                  "
                >
                  {/* Project Name */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">
                      {row.project}
                    </h4>

                    {/* Allocation Badge */}
                    <span
                      className="
                        text-xs px-3 py-1 rounded-full bg-gradient-to-r 
                        from-sky-400 to-sky-600 text-white shadow-md
                      "
                    >
                      {row.allocation}
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-sky-200/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="
                        h-full bg-sky-600 rounded-full 
                        transition-all duration-700 group-hover:bg-sky-700
                      "
                      style={{
                        width: row.allocation.replace("%", "") + "%",
                      }}
                    ></div>
                  </div>

                  {/* Sub‑info */}
                  <p className="mt-3 text-sm text-sky-800 font-medium">
                    Estimated Workload Allocation
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* TAB: TIMESHEETS */}
        {activeTab === "attendance" && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-200 hover:shadow-xl transition duration-300">

            {/* Section Title */}
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-900">
              <Clock size={22} className="text-sky-700" />
              Timesheet Summary
            </h3>

            {/* Timesheet List */}
            <div className="space-y-4">
              {timesheets.map((entry, index) => (
                <div
                  key={index}
                  className="
                    group p-5 bg-sky-50/60 border border-sky-200 rounded-xl 
                    shadow-sm backdrop-blur-sm 
                    hover:bg-sky-100 hover:shadow-lg 
                    transition-all duration-300
                  "
                >
                  {/* Date + Status */}
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold">
                      {entry.date}
                    </h4>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold shadow 
                        ${
                          entry.status === "Approved"
                            ? "bg-green-300 text-green-900"
                            : entry.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-neutral-200 text-neutral-700"
                        }
                      `}
                    >
                      {entry.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-center text-sm text-sky-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{entry.project}</span>
                      <span className="text-xs text-black">Project Name</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{entry.hours}</span>
                      <span className="text-xs text-black">Hours Logged</span>
                    </div>
                  </div>

                  {/* Progress Bar Animation */}
                  <div className="w-full bg-sky-200/50 h-2 mt-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full group-hover:bg-sky-700 transition-all duration-700"
                    style={{
                      width: `${(Number(entry.hours.replace("h", "")) / 8) * 100}%`,
                    }}
                  ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* TAB: PAYROLL */}
        {activeTab === "payroll" && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-200 hover:shadow-xl transition duration-300">

            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-900">
              <DollarSign size={22} className="text-sky-700" />
              Payroll Summary
            </h3>

            {/* Salary Card */}
            <div
              className="
                bg-gradient-to-r from-sky-500 to-sky-700 
                text-white p-6 rounded-xl shadow-md 
                flex items-center justify-between
                hover:shadow-xl transition duration-300
              "
            >
              <div>
                <p className="text-sm opacity-80">Monthly Compensation</p>
                <p className="text-3xl font-bold mt-1">
                  ₹{profile.costPerMonth?.toLocaleString()}
                </p>
              </div>

              <DollarSign className="w-10 h-10 opacity-50" />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Tax */}
              <div className="p-6 bg-sky-50/70 border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-sky-900">Tax & Deductions</h4>
                <p className="text-sky-700 text-sm mt-2">Auto‑calculated monthly</p>
                <p className="font-semibold text-neutral-800 mt-3">Coming Soon…</p>
              </div>

              {/* Breakdown */}
              <div className="p-6 bg-sky-50/70 border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="text-lg font-semibold text-sky-900">Salary Structure</h4>

                <div className="space-y-2 mt-2 text-sm">
                  <p className="text-neutral-700">Basic Salary — Coming Soon</p>
                  <p className="text-neutral-700">HRA — Coming Soon</p>
                  <p className="text-neutral-700">Special Allowance — Coming Soon</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-sky-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-sky-900">
              <FileText size={20} /> Documents
            </h3>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                isDragActive ? "bg-sky-100 border-sky-400" : "bg-sky-50 border-sky-300"
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={34} className="mx-auto mb-3 text-sky-700" />
              <p className="text-black">Drag & drop documents here</p>
              <p className="text-sm text-black">PDF, PNG, DOCX</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}