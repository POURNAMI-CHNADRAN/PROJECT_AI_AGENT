// // src/components/Layout.tsx
// import React, { ReactNode, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../auth/authContext";
// import Chatbot from "./Chatbot";

// import {
//   LayoutDashboard,
//   Users,
//   Building2,
//   Sparkles,
//   Briefcase,
//   FolderKanban,
//   FileText,
//   Calendar,
//   Clock,
//   DollarSign,
//   BarChart3,
//   Brain,
//   UserCog,
//   Bell,
//   User,
//   LogOut,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";

// interface LayoutProps {
//   children?: ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   // ✅ ICON‑ONLY DEFAULT
//   const [expanded, setExpanded] = useState(false);

//   if (!user) return <div className="h-screen bg-neutral-50" />;

//   const navItems = [
//     { path: "/my-profile", label: "My Profile", icon: User, roles: ["Employee"] },
//     { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Finance"] },
//     { path: "/segmentations", label: "Segmentations", icon: Building2, roles: ["Admin"] },
//     { path: "/resources", label: "Resources", icon: Users, roles: ["Admin", "Finance"] },
//     { path: "/skills", label: "Skills", icon: Sparkles, roles: ["Admin", "Finance"] },
//     { path: "/clients", label: "Clients", icon: Briefcase, roles: ["Admin"] },
//     { path: "/projects", label: "Projects", icon: FolderKanban, roles: ["Admin", "Finance"] },
//     { path: "/stories", label: "Stories", icon: FileText, roles: ["Admin", "Finance", "Employee"] },
//     { path: "/resource-allocation", label: "Resource Allocation", icon: Calendar, roles: ["Admin", "Finance"] },
//     { path: "/timesheets", label: "Timesheets", icon: Clock, roles: ["Admin", "Finance", "Employee"] },
//     { path: "/billing", label: "Billing", icon: DollarSign, roles: ["Admin"] },
//     { path: "/reports", label: "Reports", icon: BarChart3, roles: ["Admin"] },
//     { path: "/ai-insights", label: "AI Insights", icon: Brain, roles: ["Admin"] },
//     { path: "/user-management", label: "User Management", icon: UserCog, roles: ["Admin"] },
//   ];

//   const allowedNavItems = navItems.filter(n => n.roles.includes(user.role));

//   return (
//     <>
//       <div className="flex h-screen bg-neutral-50 overflow-hidden">

//       {/* SIDEBAR (ICON RAIL) */}
//       <aside
//         className={`
//           ${expanded ? "w-60" : "w-16"}
//           bg-sky-200 text-sky-900
//           flex flex-col
//           transition-all duration-300
//           shadow-xl
//         `}
//       >
//         {/* TOGGLE */}
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="mx-auto mt-4 mb-4
//             w-8 h-8 bg-white rounded-full
//             flex items-center justify-center
//             shadow hover:scale-105 transition"
//         >
//           {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//         </button>

//         {/* NAV (FIXED: scroll enabled) */}
//         <nav className="flex-1 overflow-y-auto flex flex-col gap-2 px-1">
//           {allowedNavItems.map(item => {
//             const Icon = item.icon;
//             const active = location.pathname.startsWith(item.path);

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`
//                   w-full flex items-center
//                   h-12 rounded-lg
//                   ${expanded ? "px-4" : "justify-center"}
//                   transition-colors
//                   ${active ? "bg-white shadow-md" : "hover:bg-white/70"}
//                 `}
//               >
//                 <Icon
//                   size={22}
//                   className={`${active ? "text-sky-900" : "text-sky-700"}`}
//                 />

//                 {expanded && (
//                   <span className="ml-3 text-sm font-medium text-sky-900">
//                     {item.label}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//         {/* MAIN */}
//         <div className="flex-1 flex flex-col overflow-hidden">

//           {/* HEADER */}
//           <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
//             <img src="/LOGO.png" className="h-10 object-contain" />

//             <div className="flex items-center gap-4">
//               <button className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition">
//                 <Bell className="w-5 h-5" />
//               </button>

//               <button className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition">
//                 <User className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={logout}
//                 className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           </header>

//           {/* CONTENT */}
//           <main className="flex-1 overflow-auto p-6">{children}</main>
//         </div>
//       </div>

//       <Chatbot />
//     </>
//   );
// }

import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import Chatbot from "./Chatbot";
import { cn } from "./ui/utils";
// import RouteTracker from "./RouteTracker";

import {
  LayoutDashboard,
  Users,
  Building2,
  Sparkles,
  Briefcase,
  FolderKanban,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
  Brain,
  UserCog,
  Bell,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
} from "lucide-react";

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <span className="text-neutral-400">Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  /* ================= NAV ITEMS ================= */

  const navItems = [
    // ✅ CORE SYSTEM
    { path: "/my-profile", label: "My Profile", icon: User, roles: ["Employee"] },
    { path: "/segmentations", label: "Segmentations", icon: Building2, roles: ["Admin"] },
    { path: "/skills", label: "Skills", icon: Sparkles, roles: ["Admin","Finance"] },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin","Finance"] },
    { path: "/resources/portfolio", label: "Resources", icon: Users, roles: ["Admin","Finance"] },
    { path: "/clients", label: "Clients", icon: Briefcase, roles: ["Admin"] },
    { path: "/projects", label: "Projects", icon: FolderKanban, roles: ["Admin","Finance"] },
    { path: "/stories", label: "Stories", icon: FileText, roles: ["Admin","Finance","Employee"] },
    { path: "/timesheets", label: "Timesheets", icon: Clock, roles: ["Admin","Finance","Employee"] },
    { path: "/billing", label: "Billing", icon: DollarSign, roles: ["Admin"] },
    { path: "/reports", label: "Reports", icon: BarChart3, roles: ["Admin"] },
    { path: "/ai-insights", label: "AI Insights", icon: Brain, roles: ["Admin"] },
    { path: "/user-management", label: "User Management", icon: UserCog, roles: ["Admin"] },

    // ✅ RESOURCE PLANNING SUITE
    // {
    //   path: "/portfolio",
    //   label: "Portfolio",
    //   icon: LayoutGrid,
    //   roles: ["Admin", "Finance"],
    // },
    // {
    //   path: "/heatmap",
    //   label: "Heatmap",
    //   icon: Calendar,
    //   roles: ["Admin", "Finance"],
    // },
    // {
    //   path: "/workload",
    //   label: "Workload",
    //   icon: Users,
    //   roles: ["Admin", "Finance"],
    // },
  ];

  const allowedNavItems = navItems.filter(n =>
    n.roles.includes(user.role)
  );

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  /* ================= RENDER ================= */

  return (
    <>
      <div className="flex h-screen bg-neutral-50 overflow-hidden">

        {/* ================= SIDEBAR ================= */}
        <aside
          className={cn(
            "bg-sky-200 text-sky-900 flex flex-col",
            "transition-all duration-300 shadow-xl",
            expanded ? "w-60" : "w-16"
          )}
        >
          {/* TOGGLE */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mx-auto my-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-105"
          >
            {expanded ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
          </button>

          {/* NAV */}
          <nav className="flex-1 overflow-y-auto flex flex-col gap-2 px-1">
            {allowedNavItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "h-12 rounded-lg flex items-center transition-colors",
                    expanded ? "px-4" : "justify-center",
                    active
                      ? "bg-white shadow-md"
                      : "hover:bg-white/70"
                  )}
                >
                  <Icon
                    size={22}
                    className={active ? "text-sky-900" : "text-sky-700"}
                  />
                  {expanded && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER */}
          <header className="h-18 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
            <img src="/LOGO.png" className="h-18 object-contain" />

            <div className="flex items-center gap-4">
              <button className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200">
                <Bell size={18}/>
              </button>
              <button className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200">
                <User size={18}/>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm"
              >
                <LogOut size={16}/> Logout
              </button>
            </div>
          </header>

          {/* ✅ ROUTER CONTENT */}
          <main className="flex-1 overflow-auto p-6">
            {/* <RouteTracker /> */}
            <Outlet />
          </main>
        </div>
      </div>

      <Chatbot />
    </>
  );
}