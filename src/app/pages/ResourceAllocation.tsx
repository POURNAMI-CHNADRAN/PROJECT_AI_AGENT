import { Plus } from "lucide-react";

const allocations = [
  { employee: "John Smith", project: "E-commerce Platform", allocation: "60%", billingType: "Billable", startDate: "2026-01-15", endDate: "2026-06-30" },
  { employee: "John Smith", project: "Mobile App Redesign", allocation: "40%", billingType: "Billable", startDate: "2026-02-01", endDate: "2026-05-15" },
  { employee: "Sarah Johnson", project: "E-commerce Platform", allocation: "100%", billingType: "Billable", startDate: "2026-01-15", endDate: "2026-06-30" },
  { employee: "Michael Chen", project: "Data Analytics Dashboard", allocation: "80%", billingType: "Billable", startDate: "2025-11-01", endDate: "2026-03-31" },
  { employee: "Michael Chen", project: "Internal Training", allocation: "20%", billingType: "Non-Billable", startDate: "2026-01-01", endDate: "2026-12-31" },
  { employee: "Emily Davis", project: "Mobile App Redesign", allocation: "100%", billingType: "Billable", startDate: "2026-02-01", endDate: "2026-05-15" },
  { employee: "Robert Wilson", project: "Cloud Migration", allocation: "50%", billingType: "Shadow", startDate: "2026-01-20", endDate: "2026-08-30" },
];

export default function ResourceAllocation() {
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-800">Resource Allocation</h1>

      {/* Allocation Form */}
      <div className="bg-white border-2 border-neutral-300 p-6 rounded">
        <h2 className="text-neutral-800 mb-4">Allocate Resource</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Employee</label>
            <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option>Select Employee</option>
              <option>John Smith</option>
              <option>Sarah Johnson</option>
              <option>Michael Chen</option>
              <option>Emily Davis</option>
              <option>Robert Wilson</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Project</label>
            <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option>Select Project</option>
              <option>E-commerce Platform</option>
              <option>Mobile App Redesign</option>
              <option>Data Analytics Dashboard</option>
              <option>Cloud Migration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Allocation %</label>
            <input
              type="number"
              placeholder="0-100"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Billing Type</label>
            <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option>Select Type</option>
              <option>Billable</option>
              <option>Non-Billable</option>
              <option>Shadow</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          <Plus className="w-4 h-4" />
          Allocate Resource
        </button>
      </div>

      {/* Allocation Table */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <h2 className="text-neutral-800 px-6 py-4 border-b-2 border-neutral-300">Current Allocations</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Employee</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Project</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Allocation %</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Billing Type</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Start Date</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">End Date</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation, index) => (
              <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{allocation.employee}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{allocation.project}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{allocation.allocation}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    allocation.billingType === 'Billable' 
                      ? 'bg-neutral-200 text-neutral-800' 
                      : allocation.billingType === 'Shadow'
                      ? 'bg-neutral-300 text-neutral-800'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {allocation.billingType}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-neutral-600">{allocation.startDate}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{allocation.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
