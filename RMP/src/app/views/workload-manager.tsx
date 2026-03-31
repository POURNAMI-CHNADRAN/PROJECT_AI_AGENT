import { useState } from "react";
import { X } from "lucide-react";
import { AllocationCell } from "../components/allocation-cell";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { employees, tasks, allocations, generateWeeks } from "../data/mock-data";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

export function WorkloadManager() {
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [reassignedEmployee, setReassignedEmployee] = useState("");
  const [taskHours, setTaskHours] = useState(0);

  const weeks = generateWeeks(12);
  const daysPerWeek = 5;

  const openReassignModal = (task: typeof tasks[0]) => {
    setSelectedTask(task);
    setReassignedEmployee(task.assigneeId);
    setTaskHours(task.hours);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setReassignedEmployee("");
    setTaskHours(0);
  };

  const handleSave = () => {
    // In a real app, this would update the task assignment
    console.log("Reassigning task", selectedTask?.id, "to", reassignedEmployee, "with", taskHours, "hours");
    closeModal();
  };

  const getEmployeeWorkload = (employeeId: string) => {
    const empAllocations = allocations.filter(a => a.employeeId === employeeId);
    const avgPercentage = empAllocations.reduce((sum, a) => sum + a.percentage, 0) / empAllocations.length;
    return Math.round(avgPercentage);
  };

  const getDailyAllocation = (employeeId: string, weekIndex: number, dayIndex: number) => {
    const allocation = allocations.find(
      a => a.employeeId === employeeId && a.weekIndex === weekIndex
    );
    
    if (!allocation) return { percentage: 0, hours: 0 };
    
    // Distribute weekly allocation across days with some variation
    const basePercentage = allocation.percentage;
    const variation = (Math.sin(dayIndex * employeeId.charCodeAt(0)) + 1) * 15;
    const dayPercentage = Math.max(0, Math.min(150, basePercentage + variation));
    
    return {
      percentage: dayPercentage,
      hours: (dayPercentage / 100) * 8
    };
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Workload Management</h1>
          <p className="text-sm text-gray-600">Task reallocation and capacity planning</p>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => {
            const assignee = employees.find(e => e.id === task.assigneeId);
            const workload = getEmployeeWorkload(task.assigneeId);
            
            return (
              <div
                key={task.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{task.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.hours}h
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {assignee?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700 min-w-[120px]">{assignee?.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      workload > 100 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : workload > 80 
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {workload}% utilized
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openReassignModal(task)}
                >
                  Reassign
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex-1 overflow-auto p-6 timeline-scroll">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Daily Workload Heatmap</h2>
            <p className="text-sm text-gray-600 mt-1">Color intensity indicates allocation level</p>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header Row */}
              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                <div className="flex">
                  <div className="w-48 border-r border-gray-200 p-3">
                    <span className="text-sm font-medium text-gray-700">Employee</span>
                  </div>
                  {weeks.slice(0, 4).map((week) => (
                    <div key={week.index} className="flex">
                      {Array.from({ length: daysPerWeek }).map((_, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="w-16 border-r border-gray-200 p-2 text-center"
                        >
                          <div className="text-xs font-medium text-gray-700">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][dayIndex]}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {week.startDate.getDate() + dayIndex}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Rows */}
              {employees.map((employee) => {
                const workload = getEmployeeWorkload(employee.id);
                
                return (
                  <div key={employee.id} className="flex border-b border-gray-200 hover:bg-gray-50">
                    <div className="w-48 border-r border-gray-200 p-3 flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {employee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {employee.name}
                        </div>
                        <div className="text-xs text-gray-500">{workload}%</div>
                      </div>
                    </div>

                    {weeks.slice(0, 4).map((week) => (
                      <div key={week.index} className="flex">
                        {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
                          const dailyAlloc = getDailyAllocation(employee.id, week.index, dayIndex);
                          
                          return (
                            <div
                              key={dayIndex}
                              className="w-16 border-r border-gray-200 p-2 flex items-center justify-center"
                            >
                              <AllocationCell
                                percentage={dailyAlloc.percentage}
                                hours={Math.round(dailyAlloc.hours)}
                                showTooltip={true}
                                size="sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium text-gray-700">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200" />
                <span className="text-gray-600">Low load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-400" />
                <span className="text-gray-600">Normal load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-gray-600">Overloaded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
                <span className="text-gray-600">Unassigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Task Modal */}
      <Dialog open={selectedTask !== null} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reassign Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Task Info */}
            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input value={selectedTask?.name || ""} disabled />
            </div>

            {/* Current Assignee */}
            <div className="space-y-2">
              <Label>Current Assignee</Label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {employees.find(e => e.id === selectedTask?.assigneeId)?.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {employees.find(e => e.id === selectedTask?.assigneeId)?.name}
                </span>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                value={taskHours}
                onChange={(e) => setTaskHours(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Reassign To */}
            <div className="space-y-2">
              <Label>Reassign To</Label>
              <Select value={reassignedEmployee} onValueChange={setReassignedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => {
                    const workload = getEmployeeWorkload(emp.id);
                    return (
                      <SelectItem key={emp.id} value={emp.id}>
                        <div className="flex items-center gap-2">
                          <span>{emp.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              workload > 100 
                                ? 'bg-red-100 text-red-700' 
                                : workload > 80 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {workload}%
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}