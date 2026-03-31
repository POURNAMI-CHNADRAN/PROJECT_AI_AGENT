import { createBrowserRouter } from "react-router";
import { HeatmapScheduler } from "./views/heatmap-scheduler";
import { PortfolioDashboard } from "./views/portfolio-dashboard";
import { WorkloadManager } from "./views/workload-manager";
import { Layout } from "./components/layout";

/**
 * Resource Scheduling Dashboard Routes
 * 
 * Three main views:
 * 1. Portfolio Dashboard (/) - Resource planning with KPIs and team allocation
 * 2. Heatmap Scheduler (/heatmap) - Advanced planning grid with weekly heatmap
 * 3. Workload Manager (/workload) - Task reallocation and daily capacity planning
 */

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: PortfolioDashboard,
      },
      {
        path: "heatmap",
        Component: HeatmapScheduler,
      },
      {
        path: "workload",
        Component: WorkloadManager,
      },
    ],
  },
]);