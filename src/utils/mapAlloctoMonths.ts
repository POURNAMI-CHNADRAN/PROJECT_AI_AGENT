export function mapAllocationsToMonths(
  allocations: any[],
  employee: any,
  months: any[]
) {
  const empId = String(employee._id);

  return months.map(m => {
    const empAllocs = allocations.filter(a => {
      const allocEmpId = a.employee?._id
        ? String(a.employee._id)
        : String(a.employee);

      return allocEmpId === empId && Number(a.month) === Number(m.month);
    });

    const totalHours = empAllocs.reduce(
      (sum, a) => sum + Number(a.fte || 0),
      0
    );

    const billableHours = empAllocs
      .filter(a => a.isBillable)
      .reduce((sum, a) => sum + Number(a.fte || 0), 0);

    return {
      hours: totalHours,
      billableAmount: billableHours * (employee.ratePerHour || 0),
    };
  });
}