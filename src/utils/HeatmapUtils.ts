const CAPACITY = 160;

export function getHeatmapColor(utilization: number) {
  if (utilization === 0) return "bg-gray-100 text-gray-400";
  if (utilization <= 60) return "bg-green-200 text-green-900";
  if (utilization <= 100) return "bg-yellow-200 text-yellow-900";
  return "bg-red-300 text-red-900";
}

export function mapAllocationsToMonths(
  allocations: any[],
  months: { month: number }[],
  year: number
) {
  return months.map(({ month }) => {
    const monthData = allocations.filter(
      (a) =>
        Number(a.month) === Number(month) &&
        Number(a.year) === Number(year)
    );

    const totalHours = monthData.reduce(
      (sum, a) => sum + Number(a.allocatedHours || 0),
      0
    );

    const billableHours = monthData
      .filter((a) => a.isBillable)
      .reduce((sum, a) => sum + Number(a.allocatedHours || 0), 0);

    const utilization =
      CAPACITY > 0 ? Math.round((totalHours / CAPACITY) * 100) : 0;

    return {
      month,
      totalHours,
      billableHours,
      utilization,
      color: getHeatmapColor(utilization),
    };
  });
}