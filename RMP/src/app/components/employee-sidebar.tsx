import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Department, Employee } from "../data/mock-data";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "./ui/utils";

interface EmployeeSidebarProps {
  departments: Department[];
  selectedEmployeeId?: string;
  onEmployeeSelect?: (employeeId: string) => void;
}

export function EmployeeSidebar({ 
  departments, 
  selectedEmployeeId,
  onEmployeeSelect 
}: EmployeeSidebarProps) {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(
    new Set(departments.map(d => d.id))
  );

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Resources</h2>
      </div>
      <div className="p-2">
        {departments.map((dept) => (
          <div key={dept.id} className="mb-2">
            <button
              onClick={() => toggleDepartment(dept.id)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {expandedDepts.has(dept.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span>{dept.name}</span>
              <span className="ml-auto text-xs text-gray-500">
                {dept.employees.length}
              </span>
            </button>
            
            {expandedDepts.has(dept.id) && (
              <div className="ml-4 mt-1 space-y-1">
                {dept.employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => onEmployeeSelect?.(employee.id)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors",
                      selectedEmployeeId === employee.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {employee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
