// import { createBrowserRouter } from "react-router";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Employees from "./pages/Resources";
// import EmployeeProfile from "./pages/EmployeeProfile";
// import Departments from "./pages/Departments";
// import Skills from "./pages/Skills";
// import Clients from "./pages/Clients";
// import Projects from "./pages/Projects";
// import Stories from "./pages/Stories";
// import ResourceAllocation from "./pages/ResourceAllocation";
// import Timesheets from "./pages/Timesheets";
// import Billing from "./pages/Billing";
// import Reports from "./pages/Reports";
// import AIInsights from "./pages/AIInsights";
// import UserManagement from "./pages/UserManagement";
// import Layout from "./components/Layout";
// import { HeatmapScheduler } from "./pages/heatmap-scheduler";
// import { PortfolioDashboard } from "./pages/portfolio-dashboard";
// import { WorkloadManager } from "./pages/workload-manager";

// export const router = createBrowserRouter([
//   {
//     path: "/login",
//     Component: Login,
//   },
//   {
//     path: "/",
//     Component: Layout,
//     children: [
//       { index: true, Component: Dashboard },
//       { path: "employees", Component: Employees },
//       { path: "employees/:id", Component: EmployeeProfile },
//       { path: "departments", Component: Departments },
//       { path: "skills", Component: Skills },
//       { path: "clients", Component: Clients },
//       { path: "projects", Component: Projects },
//       { path: "stories", Component: Stories },
//       { path: "resource-allocation", Component: ResourceAllocation },
//       { path: "timesheets", Component: Timesheets },
//       { path: "billing", Component: Billing },
//       { path: "reports", Component: Reports },
//       { path: "ai-insights", Component: AIInsights },
//       { path: "user-management", Component: UserManagement },
//       {
//         index: true,
//         Component: PortfolioDashboard,
//       },
//       {
//         path: "heatmap",
//         Component: HeatmapScheduler,
//       },
//       {
//         path: "workload",
//         Component: WorkloadManager,
//       },
//     ],
//   },
// ]);

import { createBrowserRouter, redirect } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";

/* LAYOUT */
import Layout from "./components/Layout";

/* CORE PAGES */
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Resources";
import EmployeeProfile from "./pages/EmployeeProfile";
import Departments from "./pages/Sections";
import Skills from "./pages/Skills";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Stories from "./pages/Stories";
import ResourceAllocation from "./pages/ResourceAllocation";
import Timesheets from "./pages/Timesheets";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import AIInsights from "./pages/AIInsights";
import UserManagement from "./pages/UserManagement";

/* RESOURCE PLANNING */
import { PortfolioDashboard } from "./pages/PortfolioDashboard";
import { HeatmapScheduler } from "./pages/HeatmapScheduler";
import { WorkloadManager } from "./pages/WorkloadManager";

export const router = createBrowserRouter([
  /* LOGIN */
  {
    path: "/login",
    Component: Login,
  },

  /* APP LAYOUT */
  {
    path: "/",
    Component: Layout,
    children: [
      /* ✅ DEFAULT LANDING (SAFE REDIRECT) */
      {
        index: true,
        loader: () => redirect("/dashboard"),
      },

      /* CORE SYSTEM */
      { path: "dashboard", Component: Dashboard },
      { path: "employees", Component: Employees },
      { path: "employees/:id", Component: EmployeeProfile },
      { path: "departments", Component: Departments },
      { path: "skills", Component: Skills },
      { path: "clients", Component: Clients },
      { path: "projects", Component: Projects },
      { path: "stories", Component: Stories },
      { path: "resource-allocation", Component: ResourceAllocation },
      { path: "timesheets", Component: Timesheets },
      { path: "billing", Component: Billing },
      { path: "reports", Component: Reports },
      { path: "ai-insights", Component: AIInsights },
      { path: "user-management", Component: UserManagement },

      /* RESOURCE PLANNING */
      { path: "portfolio", Component: PortfolioDashboard },
      { path: "heatmap", Component: HeatmapScheduler },
      { path: "workload", Component: WorkloadManager },
    ],
  },
]);