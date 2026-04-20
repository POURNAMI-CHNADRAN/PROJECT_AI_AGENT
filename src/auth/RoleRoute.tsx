import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

type Props = {
  allowedRoles: string[];
};

export default function RoleRoute({ allowedRoles }: Props) {
  const { user, loading } = useAuth();

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Restoring session...
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role check
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}