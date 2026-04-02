import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

export default function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children?: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // ✅ wait for auth hydration
  if (loading) return null;

  // ✅ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in but role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

// export default function RoleRoute({
//   allowedRoles,
//   children,
// }: {
//   allowedRoles: string[];
//   children: JSX.Element;
// }) {
//   const { user, loading } = useAuth();

//   /** ✅ WAIT FOR AUTH HYDRATION */
//   if (loading) {
//     return (
//       <div className="p-6 text-sky-600">
//         Restoring Session...
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }