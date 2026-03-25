import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import Chatbot from "./Chatbot";

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
} from "lucide-react";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: "/my-profile", label: "My Profile", icon: User, roles: ["Employee"] },
    { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "HR"] },
    { path: "/departments", label: "Departments", icon: Building2, roles: ["Admin"] },
    { path: "/employees", label: "Employees", icon: Users, roles: ["Admin", "HR"] },
    { path: "/skills", label: "Skills", icon: Sparkles, roles: ["Admin", "HR"] },
    { path: "/clients", label: "Clients", icon: Briefcase, roles: ["Admin"] },
    { path: "/projects", label: "Projects", icon: FolderKanban, roles: ["Admin", "HR"] },
    { path: "/stories", label: "Stories", icon: FileText, roles: ["Admin", "HR", "Employee"] },
    { path: "/resource-allocation", label: "Resource Allocation", icon: Calendar, roles: ["Admin", "HR"] },
    { path: "/timesheets", label: "Timesheets", icon: Clock, roles: ["Admin", "HR", "Employee"] },
    { path: "/billing", label: "Billing", icon: DollarSign, roles: ["Admin"] },
    { path: "/reports", label: "Reports", icon: BarChart3, roles: ["Admin"] },
    { path: "/ai-insights", label: "AI Insights", icon: Brain, roles: ["Admin"] },
    { path: "/user-management", label: "User Management", icon: UserCog, roles: ["Admin"] },
  ];

  const allowedNavItems = navItems.filter((i) => i.roles.includes(user.role));
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-neutral-50">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-50
            ${open ? "w-60" : "w-20"}
            bg-sky-200 text-sky-900
            flex flex-col py-6 rounded-r-3xl shadow-xl
            transition-all duration-300
          `}
        >
          <button
            onClick={() => setOpen(!open)}
            className="absolute -right-4 top-10 w-8 h-8 bg-white text-sky-800 rounded-full flex items-center justify-center shadow hover:scale-110 transition"
          >
            {open ? "<" : ">"}
          </button>

          <nav className={`flex-1 overflow-y-auto mt-4 ${open ? "px-4" : ""}`}>
            <div className="flex flex-col gap-3">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path} className="relative group">
                    <div
                      className={`
                        flex items-center
                        ${open ? "w-full pl-4 justify-start" : "w-12 mx-auto justify-center"}
                        h-12 rounded-xl transition-all duration-300
                        ${active ? "bg-white shadow-md" : "hover:bg-white/70"}
                      `}
                    >
                      <Icon
                        size={22}
                        className={`transition duration-300 group-hover:scale-125 ${
                          active ? "text-sky-800" : "text-sky-700"
                        }`}
                      />

                      {open && (
                        <span className={`ml-3 text-sm ${
                          active ? "font-semibold text-sky-900" : "text-sky-800 group-hover:text-sky-900"
                        }`}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-lg"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <div className={`${open ? "ml-60" : "ml-20"} flex-1 flex flex-col transition-all duration-300`}>

          {/* HEADER */}
          <header className="h-16 bg-white border-b border-neutral-300 flex items-center justify-between px-6">
            <img src="/LOGO.png" className="h-12 w-auto object-contain" />

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-neutral-200 bg-neutral-100 rounded-full transition">
                <Bell className="w-5 h-5 text-neutral-700" />
              </button>

              <button className="p-2 hover:bg-neutral-200 bg-neutral-100 rounded-full transition">
                <User className="w-5 h-5 text-neutral-700" />
              </button>

              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>

      {/* ✅ Chatbot added globally */}
      <Chatbot />
    </>
  );
}