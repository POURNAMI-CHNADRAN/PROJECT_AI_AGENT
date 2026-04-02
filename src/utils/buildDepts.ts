interface Employee {
  _id: string;
  name: string;
  departmentId?: { _id: string; name: string };
}

interface Department {
  _id: string;
  name: string;
}

interface SidebarDepartment {
  _id: string;
  name: string;
  employees: Employee[];
}

export function buildDepartments(
  departments: Department[] = [],
  employees: Employee[] = []
): SidebarDepartment[] {
  return departments.map(dept => ({
    _id: dept._id, 
    name: dept.name,
    employees: employees.filter(
      emp => emp.departmentId?._id === dept._id
    ),
  }));
}