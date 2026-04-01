export function mapAllocationsToMonths(
  allocations: any[],
  employee: any,
  months: any[]
) {
  return months.map((m) => {
    const empAllocs = allocations.filter(
      (a) =>
        (a.employee === employee._id ||
         a.employee?._id === employee._id) &&
        a.month === m.month
    );

    const totalHours = empAllocs.reduce(
      (sum, a) => sum + a.fte,
      0
    );

    const billableHours = empAllocs
      .filter((a) => a.isBillable)
      .reduce((sum, a) => sum + a.fte, 0);

    const rate = employee.ratePerHour || 0;

    return {
      hours: totalHours,
      billableAmount: billableHours * rate,
    };
  });
}