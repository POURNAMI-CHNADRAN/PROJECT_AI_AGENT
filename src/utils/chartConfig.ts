import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Correct union type usage
export const barOptions: any = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const lineOptions: any = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const, // <-- FIXED
    },
  },
};

export const donutOptions: any = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const, // <-- FIXED
    },
  },
};