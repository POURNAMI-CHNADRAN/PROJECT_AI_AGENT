// import { Outlet, Link, useLocation } from "react-router-dom";
// import { LayoutGrid, Calendar, Users } from "lucide-react";
// import { cn } from "./ui/utils";

// export default function ResourcesLayout() {
//   const location = useLocation();

//   const navItems = [
//     { path: ""}
//     { path: "/resources/portfolio", label: "Portfolio", icon: LayoutGrid },
//     { path: "/resources/heatmap", label: "Heatmap", icon: Calendar },
//     { path: "/resources/workload", label: "Workload", icon: Users },
//   ];

//   const isActive = (path: string) =>
//     location.pathname.startsWith(path);

//   return (
//     <div className="h-full flex flex-col bg-slate-50">

//       {/* ✅ RESOURCE HEADER */}
//       <div className="bg-white border-b border-sky-100 px-6 py-4 flex items-center gap-6">
//         {/* Title */}
//         <div>
//           <h1 className="text-lg font-semibold text-sky-900">
//             Resource Hub
//           </h1>
//           <p className="text-xs text-sky-600">
//             Planning & Utilization
//           </p>
//         </div>

//         {/* ✅ RESOURCE NAV (TABS) */}
//         <div className="ml-8 flex items-center bg-sky-50 rounded-lg p-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.path);

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={cn(
//                   "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition",
//                   active
//                     ? "bg-white shadow text-sky-900"
//                     : "text-sky-600 hover:text-sky-900"
//                 )}
//               >
//                 <Icon
//                   size={16}
//                   className={active ? "text-sky-700" : "text-sky-400"}
//                 />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* ✅ CONTENT */}
//       <div className="flex-1 overflow-auto bg-white p-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutGrid, Calendar, Users, Briefcase } from "lucide-react";
import { cn } from "./ui/utils";
import { useResourceData } from "../../hooks/useResourceData";

export default function ResourcesLayout() {
  const location = useLocation();
  const { employees } = useResourceData(0, 0);

  const navItems = [
    { path: "/resources/employees", label: "Manage", icon: Users },
    { path: "/resources/portfolio", label: "Portfolio", icon: LayoutGrid },
    { path: "/resources/heatmap", label: "Heatmap", icon: Calendar },
    { path: "/resources/workload", label: "Workload", icon: Briefcase },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* ===== HEADER ===== */}
      <div className="bg-white border-b border-sky-100 px-6 py-4 flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-sky-900">Resource Hub</h1>
          <p className="text-xs text-sky-600">
            Employees • Planning • Utilization
          </p>
        </div>

        {/* ✅ NAV TABS */}
        <div className="ml-8 flex items-center bg-sky-50 rounded-lg p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition",
                  active
                    ? "bg-white shadow text-sky-900"
                    : "text-sky-600 hover:text-sky-900"
                )}
              >
                <Icon
                  size={16}
                  className={active ? "text-sky-700" : "text-sky-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 overflow-auto bg-white p-6">
        <Outlet />
      </div>
    </div>
  );
}