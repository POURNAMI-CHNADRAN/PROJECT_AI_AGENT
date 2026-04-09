const CAPACITY = 160;

export function mapAllocationsToMonths(
  allocations: any[],
  employee: any,
  months: { month: number; label: string }[]
) {
  return months.map(({ month }) => {
    const monthAllocations = allocations.filter(
      (a) => a.month === month && a.year === 2026
    );

    const totalHours = monthAllocations.reduce(
      (sum, a) => sum + (a.allocatedHours || 0),
      0
    );

    const billableHours = monthAllocations
      .filter((a) => a.isBillable)
      .reduce((sum, a) => sum + (a.allocatedHours || 0), 0);

    const utilizationPct =
      CAPACITY > 0 ? Math.round((totalHours / CAPACITY) * 100) : 0;

    return {
      month,
      totalHours,
      billableHours,
      utilizationPct,
      hasData: totalHours > 0,
    };
  });
}