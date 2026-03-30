import { JSX } from "react";
import { useAuth } from "../auth/authContext";
import { Navigate } from "react-router-dom";

export default function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  /** ✅ WAIT FOR AUTH HYDRATION */
  if (loading) {
    return (
      <div className="p-6 text-sky-600">
        Restoring Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}