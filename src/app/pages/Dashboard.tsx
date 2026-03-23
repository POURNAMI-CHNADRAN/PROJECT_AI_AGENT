import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-800">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Employees</span>
            <Users className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">150</div>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Billable Employees</span>
            <UserCheck className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">120</div>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Non-Billable Employees</span>
            <UserX className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">30</div>
        </div>

        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Utilization %</span>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-3xl text-neutral-800">80%</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Billable vs Non-Billable Pie Chart */}
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <h3 className="text-neutral-800 mb-4">Billable vs Non-Billable</h3>
          <div className="h-64 border border-neutral-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full border-8 border-neutral-300 mx-auto mb-2"></div>
              <span className="text-sm text-neutral-500">[PIE CHART]</span>
            </div>
          </div>
        </div>

        {/* Project Allocation Bar Chart */}
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <h3 className="text-neutral-800 mb-4">Project Allocation</h3>
          <div className="h-64 border border-neutral-300 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-end gap-4 h-32">
                <div className="w-12 bg-neutral-300 h-24"></div>
                <div className="w-12 bg-neutral-300 h-20"></div>
                <div className="w-12 bg-neutral-300 h-28"></div>
                <div className="w-12 bg-neutral-300 h-16"></div>
              </div>
              <span className="text-sm text-neutral-500 block mt-4">[BAR CHART]</span>
            </div>
          </div>
        </div>

        {/* Revenue Trend Line Chart */}
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <h3 className="text-neutral-800 mb-4">Revenue Trend</h3>
          <div className="h-64 border border-neutral-300 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-48 h-24 mx-auto mb-2" viewBox="0 0 200 100">
                <polyline
                  points="0,80 50,60 100,40 150,50 200,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-neutral-400"
                />
              </svg>
              <span className="text-sm text-neutral-500">[LINE CHART]</span>
            </div>
          </div>
        </div>

        {/* Bench Forecast Chart */}
        <div className="bg-white border-2 border-neutral-300 p-6 rounded">
          <h3 className="text-neutral-800 mb-4">Bench Forecast</h3>
          <div className="h-64 border border-neutral-300 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-end gap-4 h-32">
                <div className="w-12 bg-neutral-400 h-20"></div>
                <div className="w-12 bg-neutral-400 h-24"></div>
                <div className="w-12 bg-neutral-400 h-18"></div>
                <div className="w-12 bg-neutral-400 h-22"></div>
              </div>
              <span className="text-sm text-neutral-500 block mt-4">[FORECAST CHART]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
