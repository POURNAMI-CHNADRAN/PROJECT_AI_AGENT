import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Departments from "./pages/Departments";
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
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
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
    ],
  },
]);
