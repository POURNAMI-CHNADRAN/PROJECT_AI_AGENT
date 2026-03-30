// App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "../auth/RoleRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";
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
import MyProfile from "./pages/MyProfile";
import EmployeeProfile from "./pages/EmployeeProfile";

import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ---------- Dashboard ---------- */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["Admin", "HR", "Employee"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Resources ---------- */}
      <Route
        path="/resources"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Resources />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/resources/:id"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <ResourceDetails />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Profile ---------- */}
      <Route
        path="/my-profile"
        element={
          <RoleRoute allowedRoles={["Admin", "HR", "Employee"]}>
            <Layout>
              <MyProfile />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Master Data ---------- */}
      <Route
        path="/departments"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Departments />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Skills />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Clients />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Projects />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Operations ---------- */}
      <Route
        path="/resource-allocation"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <ResourceAllocation />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/timesheets"
        element={
          <RoleRoute allowedRoles={["Admin", "HR", "Employee"]}>
            <Layout>
              <Timesheets />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Billing />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <Reports />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/ai-insights"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <AIInsights />
            </Layout>
          </RoleRoute>
        }
      />

      <Route
        path="/user-management"
        element={
          <RoleRoute allowedRoles={["Admin"]}>
            <Layout>
              <UserManagement />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Employee Profile ---------- */}
      <Route
        path="/employees/:id"
        element={
          <RoleRoute allowedRoles={["Admin", "HR"]}>
            <Layout>
              <EmployeeProfile />
            </Layout>
          </RoleRoute>
        }
      />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}