import { useState } from "react";
import { Search, Filter, Plus, Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "../components/kpi-card";
import { AllocationBar } from "../components/allocation-cell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { employees, projects, allocations, generateWeeks, kpiData } from "../data/mock-data";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function PortfolioDashboard() {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [searchQuery, setSearchQuery] = useState("");

  const weeks = generateWeeks(8);

  // Group employees by role
  const employeesByRole = employees.reduce((acc, emp) => {
    if (!acc[emp.role]) acc[emp.role] = [];
    acc[emp.role].push(emp);
    return acc;
  }, {} as Record<string, typeof employees>);

  const getWeekAllocation = (employeeId: string, weekIndex: number) => {
    return allocations.find(
      a => a.employeeId === employeeId && a.weekIndex === weekIndex
    );
  };

  const getEmployeeStatus = (employeeId: string) => {
    const empAllocations = allocations.filter(a => a.employeeId === employeeId);
    const avgPercentage = empAllocations.reduce((sum, a) => sum + a.percentage, 0) / empAllocations.length;
    
    if (avgPercentage > 100) return { label: "Overbooked", color: "bg-red-100 text-red-700 border-red-200" };
    if (avgPercentage > 80) return { label: "Fully Allocated", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    if (avgPercentage > 50) return { label: "Available", color: "bg-green-100 text-green-700 border-green-200" };
    return { label: "Low Utilization", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Resource Planning Dashboard</h1>
          <p className="text-sm text-gray-600">Portfolio view with team allocation overview</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, projects, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "week" | "month")}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Allocation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 timeline-scroll">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Timeline Header */}
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
            <div className="flex">
              <div className="w-80 border-r border-gray-200 p-4">
                <span className="text-sm font-medium text-gray-700">Team Members</span>
              </div>
              <div className="flex flex-1 overflow-x-auto">
                {weeks.map((week) => (
                  <div
                    key={week.index}
                    className="min-w-[120px] border-r border-gray-200 p-4 text-center"
                  >
                    <div className="text-xs text-gray-500 mb-1">{week.month}</div>
                    <div className={`text-sm font-medium ${week.isCurrentWeek ? 'text-blue-600' : 'text-gray-900'}`}>
                      {week.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {week.startDate.getDate()}-{week.endDate.getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Rows by Role */}
          <div>
            {Object.entries(employeesByRole).map(([role, roleEmployees]) => (
              <div key={role} className="border-b border-gray-200 last:border-b-0">
                {/* Role Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{role}</span>
                    <Badge variant="secondary" className="text-xs">
                      {roleEmployees.length}
                    </Badge>
                  </div>
                </div>

                {/* Employees in Role */}
                {roleEmployees
                  .filter(emp => filteredEmployees.includes(emp))
                  .map((employee) => {
                    const status = getEmployeeStatus(employee.id);
                    
                    return (
                      <div key={employee.id} className="flex hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        {/* Employee Info */}
                        <div className="w-80 border-r border-gray-200 p-4 flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                              {employee.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${status.color}`}
                              >
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Weekly Allocation */}
                        <div className="flex flex-1 overflow-x-auto">
                          {weeks.map((week) => {
                            const allocation = getWeekAllocation(employee.id, week.index);
                            const project = allocation ? projects.find(p => p.id === allocation.projectId) : null;
                            
                            return (
                              <div
                                key={week.index}
                                className="min-w-[120px] border-r border-gray-200 p-3"
                              >
                                {allocation && allocation.percentage > 0 ? (
                                  <AllocationBar
                                    percentage={allocation.percentage}
                                    hours={Math.round(allocation.hours)}
                                    label={project?.name.substring(0, 10) || "Project"}
                                    color={project?.color}
                                  />
                                ) : (
                                  <div className="h-8 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">Available</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}