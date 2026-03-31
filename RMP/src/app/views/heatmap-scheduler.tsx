import { useState } from "react";
import { ZoomIn, ZoomOut, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { EmployeeSidebar } from "../components/employee-sidebar";
import { AllocationCell } from "../components/allocation-cell";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { departments, employees, allocations, generateWeeks, projects } from "../data/mock-data";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function HeatmapScheduler() {
  const [viewMode, setViewMode] = useState<"weeks" | "months">("weeks");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [useWinProbability, setUseWinProbability] = useState(false);
  const [excludeAllocations, setExcludeAllocations] = useState(false);
  const [heatmapMetric, setHeatmapMetric] = useState("percentage");

  const weeks = generateWeeks(12);
  const cellWidth = 60 * zoomLevel;

  const getEmployeeAllocations = (employeeId: string) => {
    return weeks.map(week => {
      const allocation = allocations.find(
        a => a.employeeId === employeeId && a.weekIndex === week.index
      );
      return allocation || { percentage: 0, hours: 0, projectId: "" };
    });
  };

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.6));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <EmployeeSidebar departments={departments} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Resource Heatmap Scheduler</h1>
              <p className="text-sm text-gray-600 mt-1">Advanced planning grid with allocation overview</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={heatmapMetric} onValueChange={setHeatmapMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Heat map in %</SelectItem>
                  <SelectItem value="hours">Heat map in hours</SelectItem>
                  <SelectItem value="capacity">Heat map by capacity</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Today
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 ml-2">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            <div className="h-6 w-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <Switch 
                id="win-probability" 
                checked={useWinProbability}
                onCheckedChange={setUseWinProbability}
              />
              <Label htmlFor="win-probability" className="text-sm cursor-pointer">
                Use win probability
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id="exclude-allocations" 
                checked={excludeAllocations}
                onCheckedChange={setExcludeAllocations}
              />
              <Label htmlFor="exclude-allocations" className="text-sm cursor-pointer">
                Exclude allocations
              </Label>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">March 2026</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="flex-1 overflow-auto timeline-scroll">
          <div className="inline-block min-w-full">
            {/* Timeline Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex">
                <div className="w-64 border-r border-gray-200 p-4 flex items-center">
                  <span className="text-sm font-medium text-gray-700">Employee</span>
                </div>
                <div className="flex">
                  {weeks.map((week) => (
                    <div
                      key={week.index}
                      className="border-r border-gray-200 p-3 flex flex-col items-center justify-center"
                      style={{ width: `${cellWidth}px` }}
                    >
                      <div className="text-xs text-gray-500 mb-1">{week.month}</div>
                      <div className={`text-sm font-medium ${week.isCurrentWeek ? 'text-blue-600' : 'text-gray-900'}`}>
                        {week.label}
                      </div>
                      {week.isCurrentWeek && (
                        <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employee Rows */}
            <div className="bg-white">
              {employees.map((employee) => {
                const employeeAllocations = getEmployeeAllocations(employee.id);
                
                return (
                  <div key={employee.id} className="flex border-b border-gray-200 hover:bg-gray-50">
                    {/* Employee Info */}
                    <div className="w-64 border-r border-gray-200 p-4 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                          {employee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {employee.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {employee.role}
                        </div>
                      </div>
                    </div>

                    {/* Allocation Cells */}
                    <div className="flex">
                      {employeeAllocations.map((allocation, weekIndex) => {
                        const project = projects.find(p => p.id === allocation.projectId);
                        
                        return (
                          <div
                            key={weekIndex}
                            className="border-r border-gray-200 p-2 flex items-center justify-center"
                            style={{ width: `${cellWidth}px` }}
                          >
                            {!excludeAllocations && allocation.percentage > 0 && (
                              <AllocationCell
                                percentage={allocation.percentage}
                                hours={Math.round(allocation.hours)}
                                projectName={project?.name}
                                showTooltip={true}
                                size={zoomLevel > 1.2 ? "lg" : zoomLevel > 0.8 ? "md" : "sm"}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-6 text-sm">
                <span className="font-medium text-gray-700">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-200" />
                  <span className="text-gray-600">Under allocated (0-50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-400" />
                  <span className="text-gray-600">Well allocated (50-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-400" />
                  <span className="text-gray-600">Balanced (80-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-gray-600">Over allocated (&gt;100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}