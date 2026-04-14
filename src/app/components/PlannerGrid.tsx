import { 
  Pencil, Search, Users, ExternalLink, Briefcase, 
  Code2, Target, DollarSign, TrendingUp, ChevronRight 
} from "lucide-react";

const DEFAULT_MARGIN = 1.6;

function calculateRatePerHour(hourlyCost: number) {
  if (!hourlyCost) return 0;
  return Math.round(hourlyCost * DEFAULT_MARGIN);
}

const StatusBadge = ({ fte }: { fte: number }) => {
  const config = {
    bench: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-600/20", label: "Bench" },
    partial: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-600/20", label: "Partial" },
    full: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-600/20", label: "Full" }
  };

  const status = fte === 0 ? config.bench : fte < 1 ? config.partial : config.full;

  return (
    <span className={`inline-flex items-center rounded-md ${status.bg} px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${status.text} ring-1 ring-inset ${status.ring}`}>
      {status.label}
    </span>
  );
};

export function ResourcePlanningGrid({
  employees,
  onSelectEmployee,
}: {
  employees: any[];
  onSelectEmployee?: (emp: any) => void;
}) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] antialiased">
      
      {/* ================= PREMIUM HEADER ================= */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between bg-slate-50/30 rounded-t-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Resource Allocation
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Comprehensive overview of team utilization and skill distribution
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Filter by name, skill, or project..." 
              className="h-10 w-80 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
            />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            Insights
          </button>
        </div>
      </div>

      {/* ================= DATA GRID ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] uppercase tracking-[0.1em] text-slate-500">
              <th className="sticky left-0 z-10 bg-slate-50/80 px-6 py-4 text-left font-bold border-b border-slate-100">Member</th>
              <th className="px-4 py-4 text-left font-bold border-b border-slate-100">Role & Category</th>
              <th className="px-4 py-4 text-left font-bold border-b border-slate-100">Skill Inventory</th>
              <th className="px-4 py-4 text-left font-bold border-b border-slate-100">Active Engagements</th>
              <th className="px-4 py-4 text-center font-bold border-b border-slate-100">Capacity</th>
              <th className="px-6 py-4 text-right font-bold border-b border-slate-100">Financials</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => {
              const fte = (emp.allocations || []).reduce((sum: number, a: any) => sum + (a.fte || 0), 0) || 0;
              const projects = (emp.allocations || []).map((a: any) => a.projectId?.name).filter(Boolean) || [];

              return (
                <tr
                  key={emp._id}
                  onClick={() => onSelectEmployee?.(emp)}
                  className="group cursor-pointer transition-all hover:bg-blue-50/40"
                >
                  {/* MEMBER */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/10 px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-inner">
                          {emp.name.split(' ').map((n:any) => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${fte >= 1 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {emp.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                          ID: {emp.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {emp.primaryWorkCategoryId?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  {/* SKILL INVENTORY - All visible */}
                  <td className="px-4 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {emp.skills?.map((s: any, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300">
                          <Code2 className="h-2.5 w-2.5 text-slate-400" />
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* PROJECTS - All visible */}
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1.5">
                      {projects.length > 0 ? (
                        projects.map((p: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <Target className="h-3.5 w-3.5 text-sky-500" />
                            {p}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Available for assignment</span>
                      )}
                    </div>
                  </td>

                  {/* CAPACITY */}
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-sm font-black text-slate-800">
                        {Math.round(fte * 100)}%
                      </div>
                      <StatusBadge fte={fte} />
                    </div>
                  </td>

                  {/* FINANCIALS */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-base font-black text-slate-900">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        {calculateRatePerHour(emp.hourlyCost ?? 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Hourly Rate
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-8 py-4 rounded-b-2xl">
        <div className="flex items-center gap-4 text-sm">
          <p className="text-slate-500 font-medium">
            System Status: <span className="text-emerald-600 font-bold">Synchronized</span>
          </p>
          <div className="h-4 w-[1px] bg-slate-200" />
          <p className="text-slate-500">
            Total Headcount: <span className="text-slate-900 font-bold">{employees.length}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">
             Print
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-95">
            <ExternalLink className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}