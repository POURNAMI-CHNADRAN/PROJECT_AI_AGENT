import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: Array<"Admin" | "HR" | "Employee">;
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}