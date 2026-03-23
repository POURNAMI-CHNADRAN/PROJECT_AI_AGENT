// App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import RoleRoute from "../auth/RoleRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>
      }/>

      <Route path="/employees" element={
        <ProtectedRoute><Layout><Employees/></Layout></ProtectedRoute>
      }/>

      <Route path="/my-profile" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={["Employee","Admin","HR"]}>
            <Layout><MyProfile/></Layout>
          </RoleRoute>
        </ProtectedRoute>
      }/>

      <Route path="/departments" element={
        <ProtectedRoute><Layout><Departments/></Layout></ProtectedRoute>
      }/>

      <Route path="/skills" element={
        <ProtectedRoute><Layout><Skills/></Layout></ProtectedRoute>
      }/>

      <Route path="/clients" element={
        <ProtectedRoute><Layout><Clients/></Layout></ProtectedRoute>
      }/>

      <Route path="/projects" element={
        <ProtectedRoute><Layout><Projects/></Layout></ProtectedRoute>
      }/>

      <Route path="/stories" element={
        <ProtectedRoute><Layout><Stories/></Layout></ProtectedRoute>
      }/>

      <Route path="/resource-allocation" element={
        <ProtectedRoute><Layout><ResourceAllocation/></Layout></ProtectedRoute>
      }/>

      <Route path="/timesheets" element={
        <ProtectedRoute><Layout><Timesheets/></Layout></ProtectedRoute>
      }/>

      <Route path="/billing" element={
        <ProtectedRoute><Layout><Billing/></Layout></ProtectedRoute>
      }/>

      <Route path="/reports" element={
        <ProtectedRoute><Layout><Reports/></Layout></ProtectedRoute>
      }/>

      <Route path="/ai-insights" element={
        <ProtectedRoute><Layout><AIInsights/></Layout></ProtectedRoute>
      }/>

      <Route path="/user-management" element={
        <ProtectedRoute><Layout><UserManagement/></Layout></ProtectedRoute>
      }/>

      <Route path="/test_page" element={
        <ProtectedRoute><Layout><EmployeeProfile/></Layout></ProtectedRoute>
      }/>

      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["Admin", "HR"]}>
              <Layout>
                <EmployeeProfile />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}