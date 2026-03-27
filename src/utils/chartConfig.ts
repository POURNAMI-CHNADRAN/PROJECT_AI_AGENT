import type {
  ChartOptions,
  ScriptableContext,
  TooltipOptions,
} from "chart.js";

export const palette = {
  primary: "#38BDF8",
  primaryDeep: "#0EA5E9",
  accent: "#A78BFA",
  success: "#34D399",
  surface: "#0F172A",
  cardBg: "#1E293B",
  grid: "rgba(148,163,184,0.12)",
  tick: "#6B7280",
  tickLight: "#374151",
};

/* ---------- GRADIENT ---------- */
export const createGradient = (
  ctx: ScriptableContext<any>,
  color1: string,
  color2: string
): CanvasGradient | string => {
  const { chartArea, ctx: c } = ctx.chart;
  if (!chartArea) return color1;

  const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  return g;
};

/* ---------- TOOLTIP ---------- */
const sharedTooltip: Partial<TooltipOptions<any>> = {
  backgroundColor: "#020617",
  titleColor: "#F1F5F9",
  bodyColor: "#94A3B8",
  padding: 14,
  cornerRadius: 10,
  borderWidth: 1,
  borderColor: "#334155",
  titleFont: { size: 15, weight: 600 }, // ✅ FIXED
  bodyFont: { size: 12 },
};

/* ---------- BAR ---------- */
export const premiumBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false },

    tooltip: {
      ...sharedTooltip,
      displayColors: false,
      callbacks: {
        title: (items) => items[0]?.label || "", // ✅ FULL NAME ON HOVER
        label: (ctx) => {
          const v = ctx.parsed.y ?? 0;
          return `Revenue: ₹${v.toLocaleString("en-IN")}`;
        },
      },
    },
  },

  scales: {
  x: {
    offset: true,

    title: {
      display: true,
      text: "Projects",
      color: "#022b6c",
      font: { size: 13, weight: 600 },
      padding: { top: 12 },
    },

    ticks: {
      display: false
    },

    grid: { display: false },
  },

    y: {
      ticks: {
        color: palette.tick,
        callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
      },
      grid: { color: palette.grid },
    },
  },

  elements: {
    bar: {
      borderRadius: 12,
    },
  },
};

/* ---------- PIE ---------- */
export const premiumPieOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",

  plugins: {
    legend: {
      position: "right",
      labels: {
        color: palette.tickLight,
        font: { size: 12, weight: 500 }, // ✅ FIXED
        padding: 14,
      },
    },

    tooltip: {
      ...sharedTooltip,
      callbacks: {
        label: (ctx) => {
          const value = ctx.raw as number;
          return `${ctx.label}: ${value}`;
        },
      },
    },
  },
};

/* ---------- LINE ---------- */
export const premiumLineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false },

    tooltip: {
      ...sharedTooltip,
      callbacks: {
        label: (ctx) => {
          const v = ctx.parsed.y ?? 0;
          return `₹${v.toLocaleString("en-IN")}`;
        },
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: palette.tick,
        font: { size: 11, weight: 500 }, // ✅ FIXED
      },
      grid: { display: false },
    },

    y: {
      ticks: {
        color: palette.tick,
        callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
      },
      grid: { color: palette.grid },
    },
  },
};