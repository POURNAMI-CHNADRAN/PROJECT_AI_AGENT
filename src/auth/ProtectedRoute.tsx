import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}


// import { useAuth } from "./authContext";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading } = useAuth();

//   // ⛔ WAIT until auth hydration finishes
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // 🔒 Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // ✅ Authenticated
//   return <>{children}</>;
// }