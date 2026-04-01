export function buildDepartments(
  departments: any[],
  employees: any[]
) {
  return departments.map((dept) => ({
    id: dept._id,
    name: dept.name,
    employees: employees.filter(
      (emp) => emp.departmentId?._id === dept._id
    ),
  }));
}