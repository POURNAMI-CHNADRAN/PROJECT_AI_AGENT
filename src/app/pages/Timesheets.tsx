import { Plus } from "lucide-react";

const timesheets = [
  { employee: "John Smith", project: "E-commerce Platform", story: "User Authentication System", points: 5, date: "2026-03-15", status: "Approved" },
  { employee: "John Smith", project: "Mobile App Redesign", story: "Dashboard Redesign", points: 3, date: "2026-03-15", status: "Approved" },
  { employee: "Sarah Johnson", project: "E-commerce Platform", story: "Shopping Cart Functionality", points: 8, date: "2026-03-14", status: "Approved" },
  { employee: "Michael Chen", project: "Data Analytics Dashboard", story: "Data Visualization Components", points: 5, date: "2026-03-14", status: "Pending" },
  { employee: "Emily Davis", project: "Mobile App Redesign", story: "Dashboard Redesign", points: 5, date: "2026-03-13", status: "Approved" },
];

export default function Timesheets() {
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-800">Timesheet Management</h1>

      {/* Timesheet Form */}
      <div className="bg-white border-2 border-neutral-300 p-6 rounded">
        <h2 className="text-neutral-800 mb-4">Submit Timesheet</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
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
            <label className="block text-sm text-neutral-700 mb-2">Story</label>
            <select className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option>Select Story</option>
              <option>User Authentication System</option>
              <option>Shopping Cart Functionality</option>
              <option>Payment Gateway Integration</option>
              <option>Dashboard Redesign</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Story Points Completed</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-2">Work Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          <Plus className="w-4 h-4" />
          Submit Timesheet
        </button>
      </div>

      {/* Timesheet History */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <h2 className="text-neutral-800 px-6 py-4 border-b-2 border-neutral-300">Timesheet History</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Employee</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Project</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Story</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Points Completed</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Date</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((timesheet, index) => (
              <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{timesheet.employee}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{timesheet.project}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{timesheet.story}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{timesheet.points}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{timesheet.date}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    timesheet.status === 'Approved' 
                      ? 'bg-neutral-200 text-neutral-800' 
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {timesheet.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
