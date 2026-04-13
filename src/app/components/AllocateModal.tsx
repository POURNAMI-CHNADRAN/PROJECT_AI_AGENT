// import { useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL;

// export function AllocateModal({
//   employees,
//   projects,
//   onClose,
//   onSuccess,
// }: {
//   employees: any[];
//   projects: any[];
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [form, setForm] = useState({
//     employee: "",
//     project: "",
//     fte: 0,
//     month: new Date().getMonth() + 1,
//     year: new Date().getFullYear(),
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (key: string, value: any) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

// const submitAllocation = async () => {
//   if (!form.employee || !form.project || form.fte < 1) {
//     setError("Please select employee, project and valid FTE");
//     return;
//   }

//   if (form.fte > 160) {
//     setError("FTE cannot exceed 160 hours");
//     return;
//   }

//   try {
//     setLoading(true);
//     setError("");

//     await axios.post(
//       `${API}/api/allocations`,
//       {
//         ...form,
//         isBillable: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     onSuccess();
//     onClose();
//   } catch (err: any) {
//     setError(err.response?.data?.message || "Allocation Failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-[440px] space-y-4">
//         <h2 className="text-lg font-semibold">Allocate Resource</h2>

//         {/* Employee */}
//         <select
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.employee}
//           onChange={(e) => handleChange("employee", e.target.value)}
//         >
//           <option value="">Select Employee</option>
//           {employees.map((e) => (
//             <option key={e._id} value={e._id}>
//               {e.name}
//             </option>
//           ))}
//         </select>

//         {/* Project */}
//         <select
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.project}
//           onChange={(e) => handleChange("project", e.target.value)}
//         >
//           <option value="">Select Project</option>
//           {projects.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         {/* FTE */}
//         <input
//           type="number"
//           min={1}
//           max={160}
//           placeholder="FTE (hours)"
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.fte}
//           onChange={(e) => handleChange("fte", Number(e.target.value))}
//         />

//         {/* Month / Year */}
//         <div className="flex gap-2">
//           <input
//             type="number"
//             min={1}
//             max={12}
//             className="w-full border rounded px-3 py-2 text-sm"
//             value={form.month}
//             onChange={(e) => handleChange("month", Number(e.target.value))}
//           />
//           <input
//             type="number"
//             min={2024}
//             className="w-full border rounded px-3 py-2 text-sm"
//             value={form.year}
//             onChange={(e) => handleChange("year", Number(e.target.value))}
//           />
//         </div>

//         {error && <p className="text-sm text-red-500">{error}</p>}

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={submitAllocation}
//             disabled={loading}
//             className="px-4 py-2 bg-sky-600 text-white rounded text-sm"
//           >
//             {loading ? "Allocating…" : "Allocate"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL;
// const MONTHLY_CAPACITY = 160;

// export function AllocateModal({
//   employees,
//   projects,
//   workCategories,
//   onClose,
//   onSuccess,
// }: {
//   employees: any[];
//   projects: any[];
//   workCategories: any[];
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [form, setForm] = useState({
//     employeeId: "",
//     projectId: "",
//     workCategoryId: "",
//     allocatedHours: "",
//     month: new Date().getMonth() + 1,
//     year: new Date().getFullYear(),
//     isBillable: true,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const update = (key: string, value: any) =>
//     setForm((p) => ({ ...p, [key]: value }));

//   /* ================= SUBMIT ================= */

//   const submitAllocation = async () => {
//     const hours = Number(form.allocatedHours);

//     if (
//       !form.employeeId ||
//       !form.projectId ||
//       !form.workCategoryId ||
//       hours <= 0
//     ) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (hours > MONTHLY_CAPACITY) {
//       setError("Allocated hours cannot exceed 160");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await axios.post(
//         `${API}/api/allocations`,
//         {
//           employeeId: form.employeeId,
//           projectId: form.projectId,
//           workCategoryId: form.workCategoryId,
//           allocatedHours: hours,
//           month: form.month,
//           year: form.year,
//           isBillable: form.isBillable,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Allocation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-[440px] space-y-4">

//         <h2 className="text-lg font-semibold">Allocate Resource</h2>

//         {/* Employee */}
//         <select
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.employeeId}
//           onChange={(e) => update("employeeId", e.target.value)}
//         >
//           <option value="">Select Employee</option>
//           {employees.map((e) => (
//             <option key={e._id} value={e._id}>
//               {e.employeeCode} · {e.name}
//             </option>
//           ))}
//         </select>

//         {/* Project */}
//         <select
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.projectId}
//           onChange={(e) => update("projectId", e.target.value)}
//         >
//           <option value="">Select Project</option>
//           {projects.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         {/* Work Category */}
//         <select
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.workCategoryId}
//           onChange={(e) => update("workCategoryId", e.target.value)}
//         >
//           <option value="">Select Work Category</option>
//           {workCategories.map((w) => (
//             <option key={w._id} value={w._id}>
//               {w.name}
//             </option>
//           ))}
//         </select>

//         {/* Allocated Hours */}
//         <input
//           type="number"
//           min={1}
//           max={160}
//           placeholder="Allocated Hours (1–160)"
//           className="w-full border rounded px-3 py-2 text-sm"
//           value={form.allocatedHours}
//           onChange={(e) => update("allocatedHours", e.target.value)}
//         />

//         {/* Month / Year */}
//         <div className="flex gap-2">
//           <input
//             type="number"
//             min={1}
//             max={12}
//             className="w-full border rounded px-3 py-2 text-sm"
//             value={form.month}
//             onChange={(e) => update("month", Number(e.target.value))}
//           />
//           <input
//             type="number"
//             min={2024}
//             className="w-full border rounded px-3 py-2 text-sm"
//             value={form.year}
//             onChange={(e) => update("year", Number(e.target.value))}
//           />
//         </div>

//         {/* Billable */}
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={form.isBillable}
//             onChange={(e) => update("isBillable", e.target.checked)}
//           />
//           Billable
//         </label>

//         {error && <p className="text-sm text-red-500">{error}</p>}

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={submitAllocation}
//             disabled={loading}
//             className="px-4 py-2 bg-sky-600 text-white rounded text-sm"
//           >
//             {loading ? "Allocating…" : "Allocate"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
const MONTHLY_CAPACITY = 160;

type Mode = "create" | "edit" | "move";

interface AllocateModalProps {
  mode: Mode;
  allocation?: any;
  employees?: any[];
  projects: any[];
  workCategories?: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AllocateModal({
  mode,
  allocation,
  employees = [],
  projects,
  workCategories = [],
  onClose,
  onSuccess,
}: AllocateModalProps) {

  /* ================= STATE ================= */

  const [employeeId, setEmployeeId] = useState(
    allocation?.employeeId || ""
  );
  const [projectId, setProjectId] = useState(
    allocation?.projectId?._id ?? allocation?.projectId ?? ""
  );
  const [workCategoryId, setWorkCategoryId] = useState(
    allocation?.workCategoryId || ""
  );
  const [allocatedHours, setAllocatedHours] = useState(
    allocation?.allocatedHours?.toString() || ""
  );
  const [month, setMonth] = useState(
    allocation?.month || new Date().getMonth() + 1
  );
  const [year, setYear] = useState(
    allocation?.year || new Date().getFullYear()
  );
  const [isBillable, setIsBillable] = useState(
    allocation?.isBillable ?? true
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= SUBMIT ================= */

  const submit = async () => {
    const hours = Number(allocatedHours);

    try {
      setLoading(true);
      setError("");

      /* ================= CREATE ================= */
      if (mode === "create") {
        if (!employeeId || !projectId || !workCategoryId || hours <= 0) {
          setError("Please Fill All Required Fields");
          return;
        }

        if (hours > MONTHLY_CAPACITY) {
          setError("Allocated Hours Cannot Exceed 160");
          return;
        }

        await axios.post(
          `${API}/api/allocations`,
          {
            employeeId,
            projectId,
            workCategoryId,
            allocatedHours: hours,
            month,
            year,
            isBillable,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      /* ================= EDIT ================= */
      if (mode === "edit") {
        if (hours <= 0 || hours > MONTHLY_CAPACITY) {
          setError("Allocated hours must be between 1 and 160");
          return;
        }

        await axios.put(
          `${API}/api/allocations/${allocation._id}`,
          {
            allocatedHours: hours,
            isBillable,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      /* ================= MOVE ================= */
      if (mode === "move") {
        if (!projectId) {
          setError("Please select a project");
          return;
        }

        await axios.put(
          `${API}/api/allocations/${allocation._id}/move`,
          { newProjectId: projectId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

    {/* Modal */}
    <div className="relative bg-white rounded-xl shadow-xl p-6 w-[440px] space-y-4 z-10">

      <h2 className="text-lg font-semibold">
        {mode === "create" && "Allocate Resource"}
        {mode === "edit" && "Edit Allocation"}
        {mode === "move" && "Move Allocation"}
      </h2>

      {(mode === "create" || mode === "move") && (
        <div className="space-y-3">

          {/* Employee (CREATE ONLY) */}
          {mode === "create" && (
            <select
              className="w-full border px-3 py-2 rounded"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.employeeCode} · {e.name}
                </option>
              ))}
            </select>
          )}

          {/* Project */}
          <select
            className="w-full border px-3 py-2 rounded"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

        </div>
      )}

      {mode === "create" && (
        <select
          className="w-full border px-3 py-2 rounded"
          value={workCategoryId}
          onChange={(e) => setWorkCategoryId(e.target.value)}
        >
          <option value="">Select Work Category</option>
          {workCategories.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      )}

        {/* ===== CREATE + EDIT ===== */}
        {(mode === "create" || mode === "edit") && (
          <>
            <input
              type="number"
              min={1}
              max={160}
              className="w-full border px-3 py-2 rounded"
              placeholder="Allocate Hours"
              value={allocatedHours}
              onChange={(e) => setAllocatedHours(e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isBillable}
                onChange={(e) => setIsBillable(e.target.checked)}
              />
              Billable
            </label>
          </>
        )}

        {/* ===== MONTH / YEAR (CREATE ONLY) ===== */}
        {mode === "create" && (
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={12}
              className="w-full border px-3 py-2 rounded"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              placeholder="Month"
            />
            <input
              type="number"
              min={2024}
              className="w-full border px-3 py-2 rounded"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="Year"
            />
          </div>
        )}

        {/* ===== ERROR ===== */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-sky-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}