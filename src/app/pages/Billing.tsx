import { DollarSign, TrendingUp, Briefcase } from "lucide-react";

const billingData = [
  { project: "E-commerce Platform", employee: "John Smith", pointsCompleted: 24, billingRate: "$150/point", revenue: "$3,600" },
  { project: "E-commerce Platform", employee: "Sarah Johnson", pointsCompleted: 32, billingRate: "$140/point", revenue: "$4,480" },
  { project: "Mobile App Redesign", employee: "John Smith", pointsCompleted: 16, billingRate: "$150/point", revenue: "$2,400" },
  { project: "Mobile App Redesign", employee: "Emily Davis", pointsCompleted: 28, billingRate: "$130/point", revenue: "$3,640" },
  { project: "Data Analytics Dashboard", employee: "Michael Chen", pointsCompleted: 20, billingRate: "$145/point", revenue: "$2,900" },
  { project: "Cloud Migration", employee: "Robert Wilson", pointsCompleted: 18, billingRate: "$140/point", revenue: "$2,520" },
];

export default function Billing() {
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-800">Billing & Revenue</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">$19,540</div>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Billable Hours Equivalent</span>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">138 pts</div>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Active Projects</span>
            <Briefcase className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">4</div>
        </div>
      </div>

      {/* Billing Report Table */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <h2 className="text-neutral-800 px-6 py-4 border-b-2 border-neutral-300">Billing Report</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Project</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Employee</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Story Points Completed</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Billing Rate</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((item, index) => (
              <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{item.project}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{item.employee}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{item.pointsCompleted}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{item.billingRate}</td>
                <td className="px-6 py-3 text-sm text-neutral-800">{item.revenue}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-neutral-100 border-t-2 border-neutral-300">
              <td className="px-6 py-3 text-sm text-neutral-800" colSpan={4}>Total</td>
              <td className="px-6 py-3 text-sm text-neutral-800">$19,540</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Revenue by Project */}
      <div className="bg-white border-2 border-neutral-300 p-6 rounded">
        <h2 className="text-neutral-800 mb-4">Revenue by Project</h2>
        <div className="h-64 border border-neutral-300 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-end gap-6 h-40 justify-center">
              <div className="text-center">
                <div className="w-16 bg-neutral-300 h-32"></div>
                <span className="text-xs text-neutral-600 mt-2 block">E-commerce</span>
              </div>
              <div className="text-center">
                <div className="w-16 bg-neutral-300 h-24"></div>
                <span className="text-xs text-neutral-600 mt-2 block">Mobile App</span>
              </div>
              <div className="text-center">
                <div className="w-16 bg-neutral-300 h-20"></div>
                <span className="text-xs text-neutral-600 mt-2 block">Analytics</span>
              </div>
              <div className="text-center">
                <div className="w-16 bg-neutral-300 h-16"></div>
                <span className="text-xs text-neutral-600 mt-2 block">Cloud</span>
              </div>
            </div>
            <span className="text-sm text-neutral-500 block mt-6">[REVENUE CHART]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
