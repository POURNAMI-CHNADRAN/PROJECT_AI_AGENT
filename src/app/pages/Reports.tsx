// import { FileText, Download } from "lucide-react";

// const reports = [
//   { 
//     title: "Resource Utilization Report", 
//     description: "Track employee billable vs non-billable allocation across projects",
//     icon: "📊"
//   },
//   { 
//     title: "Project Revenue Report", 
//     description: "Detailed revenue breakdown by project and billing model",
//     icon: "💰"
//   },
//   { 
//     title: "Resource Allocation Report", 
//     description: "View current and historical resource allocations",
//     icon: "📅"
//   },
//   { 
//     title: "Bench Forecast Report", 
//     description: "Predict future bench resources and capacity planning",
//     icon: "📈"
//   },
// ];

// export default function Reports() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-neutral-800">Reports</h1>

//       {/* Report Options */}
//       <div className="grid grid-cols-2 gap-4">
//         {reports.map((report) => (
//           <div key={report.title} className="bg-white border-2 border-neutral-300 p-6 rounded hover:bg-neutral-50 cursor-pointer transition-colors">
//             <div className="flex items-start justify-between mb-3">
//               <div className="text-3xl">{report.icon}</div>
//               <FileText className="w-5 h-5 text-neutral-400" />
//             </div>
//             <h3 className="text-neutral-800 mb-2">{report.title}</h3>
//             <p className="text-sm text-neutral-600 mb-4">{report.description}</p>
//             <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
//               <Download className="w-4 h-4" />
//               Generate Report
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Sample Report Display */}
//       <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
//         <div className="px-6 py-4 border-b-2 border-neutral-300 flex items-center justify-between">
//           <h2 className="text-neutral-800">Resource Utilization Report - March 2026</h2>
//           <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
//             <Download className="w-4 h-4" />
//             Export PDF
//           </button>
//         </div>

//         {/* Chart Placeholder */}
//         <div className="p-6">
//           <div className="h-64 border border-neutral-300 flex items-center justify-center mb-6">
//             <div className="text-center">
//               <div className="flex items-end gap-6 h-40 justify-center">
//                 <div className="text-center">
//                   <div className="w-16 bg-neutral-400 h-36"></div>
//                   <span className="text-xs text-neutral-600 mt-2 block">Week 1</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 bg-neutral-400 h-32"></div>
//                   <span className="text-xs text-neutral-600 mt-2 block">Week 2</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 bg-neutral-400 h-34"></div>
//                   <span className="text-xs text-neutral-600 mt-2 block">Week 3</span>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 bg-neutral-400 h-30"></div>
//                   <span className="text-xs text-neutral-600 mt-2 block">Week 4</span>
//                 </div>
//               </div>
//               <span className="text-sm text-neutral-500 block mt-6">[UTILIZATION CHART]</span>
//             </div>
//           </div>

//           {/* Data Table */}
//           <table className="w-full">
//             <thead>
//               <tr className="bg-neutral-100 border-b-2 border-neutral-300">
//                 <th className="text-left px-6 py-3 text-sm text-neutral-700">Department</th>
//                 <th className="text-left px-6 py-3 text-sm text-neutral-700">Total Employees</th>
//                 <th className="text-left px-6 py-3 text-sm text-neutral-700">Billable</th>
//                 <th className="text-left px-6 py-3 text-sm text-neutral-700">Non-Billable</th>
//                 <th className="text-left px-6 py-3 text-sm text-neutral-700">Utilization %</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b border-neutral-200">
//                 <td className="px-6 py-3 text-sm text-neutral-800">Engineering</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">60</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">48</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">12</td>
//                 <td className="px-6 py-3 text-sm text-neutral-800">80%</td>
//               </tr>
//               <tr className="border-b border-neutral-200">
//                 <td className="px-6 py-3 text-sm text-neutral-800">Product</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">20</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">18</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">2</td>
//                 <td className="px-6 py-3 text-sm text-neutral-800">90%</td>
//               </tr>
//               <tr className="border-b border-neutral-200">
//                 <td className="px-6 py-3 text-sm text-neutral-800">Design</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">25</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">19</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">6</td>
//                 <td className="px-6 py-3 text-sm text-neutral-800">76%</td>
//               </tr>
//               <tr className="border-b border-neutral-200">
//                 <td className="px-6 py-3 text-sm text-neutral-800">Quality</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">15</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">12</td>
//                 <td className="px-6 py-3 text-sm text-neutral-600">3</td>
//                 <td className="px-6 py-3 text-sm text-neutral-800">80%</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Download } from "lucide-react";
import * as XLSX from "xlsx";

/* ================= TYPES ================= */

type Utilization = {
  name: string;
  billable_percent: number;
  non_billable_percent: number;
};

type Revenue = {
  projectName: string;
  revenue: number;
};

type Bench = {
  name: string;
};

/* ================= REPORT CARDS ================= */

const reports = [
  {
    title: "Resource Utilization Report",
    description: "Track employee billable vs non-billable allocation",
    icon: "📊",
  },
  {
    title: "Project Revenue Report",
    description: "Revenue breakdown by project",
    icon: "💰",
  },
  {
    title: "Resource Allocation Report",
    description: "View current allocations",
    icon: "📅",
  },
  {
    title: "Bench Forecast Report",
    description: "Identify unused capacity",
    icon: "📈",
  },
];

/* ================= COMPONENT ================= */

export default function Reports() {
  const [utilization, setUtilization] = useState<Utilization[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [bench, setBench] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState<number>(4);
  const [year, setYear] = useState<number>(2026);

  const API = "http://localhost:5000/api/reports";

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [utilRes, revRes, benchRes] = await Promise.all([
        axios.get<Utilization[]>(
          `${API}/utilization?month=${month}&year=${year}`
        ),
        axios.get<Revenue[]>(`${API}/revenue-project`),
        axios.get<{ employees: Bench[] }>(`${API}/bench`),
      ]);

      setUtilization(utilRes.data);
      setRevenue(revRes.data);
      setBench(benchRes.data.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  /* ================= EXPORT ================= */

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(utilization),
      "Utilization"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(revenue),
      "Revenue"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(bench),
      "Bench"
    );

    XLSX.writeFile(wb, "Reports.xlsx");
  };

  const exportPDF = () => window.print();

  /* ================= UI ================= */

  return (
    <div className="bg-sky-50 min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-sky-900">
        Reports Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex gap-4 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="p-2 border rounded w-24"
        />

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      {/* REPORT CARDS */}
      <div className="grid grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="bg-white border border-sky-200 p-6 rounded-xl shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between mb-3">
              <div className="text-3xl">{report.icon}</div>
              <FileText className="text-sky-400" />
            </div>

            <h3 className="text-sky-900 font-medium mb-2">
              {report.title}
            </h3>

            <p className="text-sm text-sky-700 mb-4">
              {report.description}
            </p>

            <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
              <Download className="w-4 h-4" />
              Generate
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* UTILIZATION */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-sky-900">
              Utilization
            </h2>

            {utilization.map((emp) => (
              <div key={emp.name} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{emp.name}</span>
                  <span>{emp.billable_percent}%</span>
                </div>

                <div className="bg-sky-100 h-3 rounded">
                  <div
                    className="bg-sky-500 h-3 rounded"
                    style={{ width: `${emp.billable_percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* REVENUE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-sky-900">
              Revenue by Project
            </h2>

            <table className="w-full">
              <thead>
                <tr className="bg-sky-100">
                  <th className="p-2 text-left">Project</th>
                  <th className="p-2 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((r) => (
                  <tr key={r.projectName} className="border-b">
                    <td className="p-2">{r.projectName}</td>
                    <td className="p-2">₹{r.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BENCH */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-sky-900">
              Bench Employees
            </h2>

            {bench.length === 0 ? (
              <p className="text-green-600">
                🎉 No Bench Employees — Fully Utilized!
              </p>
            ) : (
              <ul>
                {bench.map((b) => (
                  <li key={b.name} className="p-2 border-b">
                    {b.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}