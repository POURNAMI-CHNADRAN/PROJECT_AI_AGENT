// import React, { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import { Sparkles, Trash2 } from "lucide-react";

// export default function EmployeeProfile() {
//   const { id } = useParams(); // employee ID from URL
//   const [params] = useSearchParams();
//   const defaultTab = params.get("tab") || "profile";

//   const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
//   const token = localStorage.getItem("token");
//   const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;

//   const [employee, setEmployee] = useState<any>(null);
//   const [skills, setSkills] = useState<any[]>([]);
//   const [allSkills, setAllSkills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [activeTab, setActiveTab] = useState(defaultTab);

//   // Assign Skill Modal
//   const [showAddSkill, setShowAddSkill] = useState(false);
//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [proficiency, setProficiency] = useState(3);

//   const PROF_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

//   const BAR_WIDTH = {
//     Beginner: "25%",
//     Intermediate: "50%",
//     Advanced: "75%",
//     Expert: "100%",
//   };

//   // ==========================================================
//   // 🔵 Fetch Employee Details
//   // ==========================================================
//   const loadEmployee = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/employees/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setEmployee(data.data || null);
//     } catch (err) {
//       console.error("Employee Load Error:", err);
//     }
//   };

//   // ==========================================================
//   // 🔵 Fetch Employee Assigned Skills
//   // ==========================================================
//   const loadSkills = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/employee-skills/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setSkills(data.data || []);
//     } catch (err) {
//       console.error("Skill Load Error:", err);
//     }
//   };

//   // ==========================================================
//   // 🔵 Fetch Skill Master List (Active Skills Only)
//   // ==========================================================
//   const loadSkillMaster = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/skills`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setAllSkills(data.data || []); // all active skills
//     } catch (err) {
//       console.error("Skill Master Load Error:", err);
//     }
//   };

//   // ==========================================================
//   // 🔵 Assign Skill
//   // ==========================================================
//     const handleAddSkill = async () => {
//     if (!selectedSkill) {
//         alert("Please select a skill");
//         return;
//     }

//     const res = await fetch(`${API_BASE}/api/employee-skills/${id}`, {
//         method: "POST",
//         headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//         skillId: selectedSkill,
//         proficiency: PROF_LEVELS[proficiency - 1], // Convert number → enum
//         }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//         alert(data.message || "Skill already assigned or invalid");
//         return;
//     }

//     setShowAddSkill(false);
//     await loadSkills();
//     await loadSkillMaster();
//     };

//   // ==========================================================
//   // 🔵 Remove Skill
//   // ==========================================================
//   const removeSkill = async (mappingId: string) => {
//     await fetch(`${API_BASE}/api/employee-skills/mapping/${mappingId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     await loadSkills();
//   };

//   // ==========================================================
//   // 🔵 Load Data
//   // ==========================================================
//   useEffect(() => {
//     Promise.all([loadEmployee(), loadSkills(), loadSkillMaster()]).then(() =>
//       setLoading(false)
//     );
//   }, []);

//   if (loading || !employee) {
//     return <div className="p-6 text-sky-700 text-lg">Loading...</div>;
//   }

//   return (
//     <div className="p-6 space-y-10 bg-sky-50">
      
//       {/* HEADER */}
//       <div className="bg-sky-200 p-7 rounded-xl shadow flex items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-sky-900">{employee.name}</h1>
//           <p className="text-sky-700">{employee.email}</p>
//         </div>
//       </div>

//       {/* TAB NAV */}
//       <div className="flex gap-6 border-b pb-3 font-medium">
//         {[
//           { id: "profile", label: "Profile" },
//           { id: "skills", label: "Skills" },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`pb-2 transition-all ${
//               activeTab === tab.id
//                 ? "border-b-2 border-sky-600 text-sky-700 font-semibold"
//                 : "text-sky-700 hover:text-sky-900"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* TAB CONTENT */}
//       <div className="animate-fade-in">

//         {/* PROFILE TAB */}
//         {activeTab === "profile" && (
//         <div className="bg-white p-8 rounded-2xl shadow-xl border border-sky-200">

//             {/* Title */}
//             <h2 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-2">
//             <Sparkles className="w-6 h-6 text-sky-700" />
//             Employee Profile Information
//             </h2>

//             {/* Card Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Role Card */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Role</p>
//                 <p className="text-lg font-bold mt-1">{employee.role}</p>
//             </div>

//             {/* Department Card */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Department</p>
//                 <p className="text-lg font-bold mt-1">
//                 {employee?.departmentId?.name || "Not Assigned"}
//                 </p>
//             </div>

//             {/* Location Card */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Location</p>
//                 <p className="text-lg font-bold mt-1">
//                 {employee.location || "Unknown"}
//                 </p>
//             </div>

//             {/* Joining Date */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Joined On</p>
//                 <p className="text-lg font-bold mt-1">
//                 {new Date(employee.joiningDate).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                 })}
//                 </p>
//             </div>

//             {/* Cost per Month */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Cost / Month</p>
//                 <p className="text-lg font-bold mt-1">
//                 ₹{employee.costPerMonth?.toLocaleString()}
//                 </p>
//             </div>

//             {/* Employee ID */}
//             <div className="p-6 bg-sky-50 rounded-xl border border-sky-200 shadow-sm hover:shadow-md transition">
//                 <p className="text-sm font-semibold text-sky-700">Employee ID</p>
//                 <p className="text-lg font-bold mt-1">
//                 {employee.employeeId}
//                 </p>
//             </div>

//             </div>

//         </div>
//         )}

//         {/* SKILLS TAB */}
//         {activeTab === "skills" && (
//           <div className="bg-white p-8 rounded-xl shadow border border-sky-200">

//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold flex items-center gap-3 text-sky-900">
//                 <Sparkles className="w-6 h-6 text-sky-700" />
//                 Employee Skills
//               </h3>

//               {(userRole === "Admin" || userRole === "HR") && (
//                 <button
//                   onClick={() => setShowAddSkill(true)}
//                   className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
//                 >
//                   + Assign Skill
//                 </button>
//               )}
//             </div>

//             {/* Skills List */}
//             {skills.length === 0 ? (
//               <p>No skills assigned.</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {skills.map((item) => (
//                   <div
//                     key={item._id}
//                     className="p-6 border border-sky-200 bg-sky-50 rounded-xl shadow"
//                   >
//                     <div className="flex justify-between items-center">
//                       <h4 className="font-semibold text-sky-900">
//                         {item.skillId.name}
//                       </h4>

//                       {(userRole === "Admin" || userRole === "HR") && (
//                         <button onClick={() => removeSkill(item._id)}>
//                           <Trash2 size={16} className="text-red-600" />
//                         </button>
//                       )}
//                     </div>

//                     <p className="text-sm text-sky-700">
//                       Level {item.proficiency}
//                     </p>

//                     <div className="w-full bg-sky-200 h-2 rounded mt-2">
//                       <div
//                         className="h-full bg-sky-600 rounded"
//                         style={{
//                           width: `${(item.proficiency / 5) * 100}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         )}
//       </div>

//       {/* ASSIGN SKILL MODAL */}
//       {showAddSkill && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl w-[400px] shadow">

//             <h2 className="text-xl font-bold text-sky-900 mb-4">Assign Skill</h2>

//             <select
//               className="border border-sky-300 p-2 w-full rounded"
//               value={selectedSkill}
//               onChange={(e) => setSelectedSkill(e.target.value)}
//             >
//               <option value="">Select Skill</option>
//               {allSkills.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mt-4 text-sky-900 font-medium">
//             Proficiency: {PROF_LEVELS[proficiency - 1]}
//             </label>

//             <input
//             type="range"
//             min="1"
//             max="4"
//             value={proficiency}
//             onChange={(e) => setProficiency(Number(e.target.value))}
//             className="w-full"
//             />

//             <div className="flex justify-end mt-6 gap-3">
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded"
//                 onClick={() => setShowAddSkill(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="px-4 py-2 bg-sky-600 text-white rounded"
//                 onClick={handleAddSkill}
//               >
//                 Save
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

import { X } from "lucide-react";

export default function EmployeeDrawer({ employee, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* panel */}
      <div className="w-[420px] bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <Section title="Employee Info">
          <Row label="Joining Date" value={employee.joiningDate?.slice(0,10)} />
          <Row label="Manager" value={employee.manager || "—"} />
          <Row label="Experience" value={`${employee.experience} yrs`} />
          <Row label="Location" value={employee.location} />
        </Section>

        <Section title="Current Allocation">
          {employee.allocations?.map((a: any) => (
            <div key={a._id} className="border rounded p-2 mb-2">
              <div className="font-medium">{a.project.name}</div>
              <div className="text-xs text-gray-500">
                {a.fte}h · {a.isBillable ? "Billable" : "Non‑Billable"}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Actions">
          <button className="btn-primary">Edit FTE</button>
          <button className="btn-secondary">Move Project</button>
          <button className="btn-secondary">Billing History</button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold mb-2 text-sky-900">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}