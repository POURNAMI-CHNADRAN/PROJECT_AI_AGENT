type Allocation = {
  month: number;
  year: number;
  allocatedHours: number;
  isBillable: boolean;
  projectId: {
    _id: string;
    name: string;
  };
};

type ProjectData = {
  projectName: string;
  hours: number;
  isBillable: boolean;
};

type MonthlyData = {
  month: number;
  totalHours: number;
  billableHours: number;
  utilizationPct: number;
  hasData: boolean;
  color: string;
  projects: ProjectData[];
};

const CAPACITY = 160;

function getHeatmapColor(utilization: number): string {
  if (utilization === 0) return "bg-gray-100 text-gray-400";
  if (utilization <= 60) return "bg-green-200 text-green-900";
  if (utilization <= 100) return "bg-yellow-200 text-yellow-900";
  return "bg-red-300 text-red-900";
}

export function mapAllocationsToMonths(
  allocations: Allocation[],
  months: [],
  year: number
): MonthlyData[] {
  return months.map(({ month }) => {
    const monthData = allocations.filter(
      (a) => a.month === month && a.year === year
    );

    const totalHours = monthData.reduce(
      (sum, a) => sum + a.allocatedHours,
      0
    );

    const billableHours = monthData
      .filter((a) => a.isBillable)
      .reduce((sum, a) => sum + a.allocatedHours, 0);

    const utilizationPct =
      CAPACITY > 0 ? Math.round((totalHours / CAPACITY) * 100) : 0;

    // ✅ PROJECT BREAKDOWN
    const projects = monthData.map((a) => ({
      projectName: a.projectId?.name || "Unknown",
      hours: a.allocatedHours,
      isBillable: a.isBillable,
    }));

    return {
      month,
      totalHours,
      billableHours,
      utilizationPct,
      hasData: totalHours > 0,
      color: getHeatmapColor(utilizationPct),
      projects, 
    };
  });
}