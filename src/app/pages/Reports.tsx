import { FileText, Download } from "lucide-react";

const reports = [
  { 
    title: "Resource Utilization Report", 
    description: "Track employee billable vs non-billable allocation across projects",
    icon: "📊"
  },
  { 
    title: "Project Revenue Report", 
    description: "Detailed revenue breakdown by project and billing model",
    icon: "💰"
  },
  { 
    title: "Resource Allocation Report", 
    description: "View current and historical resource allocations",
    icon: "📅"
  },
  { 
    title: "Bench Forecast Report", 
    description: "Predict future bench resources and capacity planning",
    icon: "📈"
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-800">Reports</h1>

      {/* Report Options */}
      <div className="grid grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.title} className="bg-white border-2 border-neutral-300 p-6 rounded hover:bg-neutral-50 cursor-pointer transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{report.icon}</div>
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>
            <h3 className="text-neutral-800 mb-2">{report.title}</h3>
            <p className="text-sm text-neutral-600 mb-4">{report.description}</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Sample Report Display */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-neutral-300 flex items-center justify-between">
          <h2 className="text-neutral-800">Resource Utilization Report - March 2026</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        {/* Chart Placeholder */}
        <div className="p-6">
          <div className="h-64 border border-neutral-300 flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="flex items-end gap-6 h-40 justify-center">
                <div className="text-center">
                  <div className="w-16 bg-neutral-400 h-36"></div>
                  <span className="text-xs text-neutral-600 mt-2 block">Week 1</span>
                </div>
                <div className="text-center">
                  <div className="w-16 bg-neutral-400 h-32"></div>
                  <span className="text-xs text-neutral-600 mt-2 block">Week 2</span>
                </div>
                <div className="text-center">
                  <div className="w-16 bg-neutral-400 h-34"></div>
                  <span className="text-xs text-neutral-600 mt-2 block">Week 3</span>
                </div>
                <div className="text-center">
                  <div className="w-16 bg-neutral-400 h-30"></div>
                  <span className="text-xs text-neutral-600 mt-2 block">Week 4</span>
                </div>
              </div>
              <span className="text-sm text-neutral-500 block mt-6">[UTILIZATION CHART]</span>
            </div>
          </div>

          {/* Data Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 border-b-2 border-neutral-300">
                <th className="text-left px-6 py-3 text-sm text-neutral-700">Department</th>
                <th className="text-left px-6 py-3 text-sm text-neutral-700">Total Employees</th>
                <th className="text-left px-6 py-3 text-sm text-neutral-700">Billable</th>
                <th className="text-left px-6 py-3 text-sm text-neutral-700">Non-Billable</th>
                <th className="text-left px-6 py-3 text-sm text-neutral-700">Utilization %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="px-6 py-3 text-sm text-neutral-800">Engineering</td>
                <td className="px-6 py-3 text-sm text-neutral-600">60</td>
                <td className="px-6 py-3 text-sm text-neutral-600">48</td>
                <td className="px-6 py-3 text-sm text-neutral-600">12</td>
                <td className="px-6 py-3 text-sm text-neutral-800">80%</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-6 py-3 text-sm text-neutral-800">Product</td>
                <td className="px-6 py-3 text-sm text-neutral-600">20</td>
                <td className="px-6 py-3 text-sm text-neutral-600">18</td>
                <td className="px-6 py-3 text-sm text-neutral-600">2</td>
                <td className="px-6 py-3 text-sm text-neutral-800">90%</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-6 py-3 text-sm text-neutral-800">Design</td>
                <td className="px-6 py-3 text-sm text-neutral-600">25</td>
                <td className="px-6 py-3 text-sm text-neutral-600">19</td>
                <td className="px-6 py-3 text-sm text-neutral-600">6</td>
                <td className="px-6 py-3 text-sm text-neutral-800">76%</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-6 py-3 text-sm text-neutral-800">Quality</td>
                <td className="px-6 py-3 text-sm text-neutral-600">15</td>
                <td className="px-6 py-3 text-sm text-neutral-600">12</td>
                <td className="px-6 py-3 text-sm text-neutral-600">3</td>
                <td className="px-6 py-3 text-sm text-neutral-800">80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
