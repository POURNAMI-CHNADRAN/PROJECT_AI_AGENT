import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import Chatbot from "./Chatbot";
import { cn } from "./ui/utils";

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FolderKanban,
  FileText,
  Clock,
  DollarSign,
  Brain,
  UserCog,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Search,
  Command,
  X,
} from "lucide-react";

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /* Sidebar collapsed by default */
  const [expanded, setExpanded] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* Employee Search */
  const [search, setSearch] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);

  useEffect(() => {
    const closeMenus = () => {
      setShowNotifications(false);
      setShowProfileMenu(false);
      setShowSearchBox(false);
    };

    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-sky-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sky-700 font-medium">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* Example Employees */
  const employees = [
    { id: 1, name: "John David", role: "Developer" },
    { id: 2, name: "Sarah Lee", role: "Designer" },
    { id: 3, name: "Michael Roy", role: "Finance" },
    { id: 4, name: "Emma Watson", role: "HR" },
    { id: 5, name: "Daniel Jose", role: "Admin" },
  ];

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return [];
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const navGroups = [
    {
      group: "Overview",
      items: [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          roles: ["Admin", "Finance"],
        },
        {
          path: "/ai-insights",
          label: "AI Insights",
          icon: Brain,
          roles: ["Admin"],
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          path: "/projects",
          label: "Projects",
          icon: FolderKanban,
          roles: ["Admin", "Finance"],
        },
        {
          path: "/resources/portfolio",
          label: "Resources",
          icon: Users,
          roles: ["Admin", "Finance"],
        },
        {
          path: "/clients",
          label: "Clients",
          icon: Briefcase,
          roles: ["Admin"],
        },
      ],
    },
    {
      group: "Operations",
      items: [
        {
          path: "/stories",
          label: "Stories",
          icon: FileText,
          roles: ["Admin", "Finance", "Employee"],
        },
        {
          path: "/timesheets",
          label: "Timesheets",
          icon: Clock,
          roles: ["Admin", "Finance", "Employee"],
        },
        {
          path: "/billing",
          label: "Billing",
          icon: DollarSign,
          roles: ["Admin"],
        },
      ],
    },
    {
      group: "Settings",
      items: [
        {
          path: "/user-management",
          label: "Users",
          icon: UserCog,
          roles: ["Admin"],
        },
        {
          path: "/segmentations",
          label: "Org Config",
          icon: Building2,
          roles: ["Admin"],
        },
        {
          path: "/my-profile",
          label: "My Profile",
          icon: User,
          roles: ["Admin", "Finance", "Employee"],
        },
      ],
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden text-slate-800">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "relative flex flex-col bg-white border-r border-sky-100 shadow-sm transition-all duration-300 shrink-0",
          expanded ? "w-72" : "w-20"
        )}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-sky-100 shrink-0">
          <img
            src="/LOGO_COPY.png"
            alt="Logo"
            className={cn(
              "object-contain transition-all",
              expanded ? "h-12 w-auto" : "h-10 w-10"
            )}
          />
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -right-3 top-24 h-7 w-7 rounded-full bg-sky-500 text-white shadow-md flex items-center justify-center hover:scale-105 transition"
        >
          <ChevronRight
            size={14}
            className={cn(expanded && "rotate-180 transition")}
          />
        </button>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 overflow-hidden">
          <div className="space-y-4">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                {expanded && (
                  <p className="px-3 mb-2 text-[10px] uppercase font-bold tracking-widest text-sky-400">
                    {group.group}
                  </p>
                )}

                <div className="space-y-1">
                  {group.items
                    .filter((item) => item.roles.includes(user.role))
                    .map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          title={!expanded ? item.label : ""}
                          className={cn(
                            "h-11 rounded-xl flex items-center transition-all",
                            expanded ? "px-3" : "justify-center",
                            active
                              ? "bg-sky-500 text-white shadow-md"
                              : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                          )}
                        >
                          <Icon size={18} />

                          {expanded && (
                            <span className="ml-3 text-sm font-medium truncate">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t border-sky-100">
          <button
            onClick={logout}
            className="w-full h-11 rounded-xl flex items-center gap-3 px-3 text-rose-500 hover:bg-rose-50 transition"
          >
            <LogOut size={18} />
            {expanded && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-sky-100 px-8 flex items-center justify-between shrink-0">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-5 w-full max-w-3xl">
            {/* LOGO LEFT OF SEARCH */}
            <img
              src="/LOGO_COPY.png"
              alt="Logo"
              className="h-11 object-contain"
            />

            {/* SEARCH */}
            <div
              className="relative flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400"
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearchBox(true);
                }}
                onFocus={() => setShowSearchBox(true)}
                type="text"
                placeholder="Search employees..."
                className="w-full h-11 rounded-2xl bg-sky-50 border border-sky-100 pl-12 pr-16 text-sm outline-none focus:ring-2 focus:ring-sky-300"
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setShowSearchBox(false);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X size={15} />
                </button>
              )}

              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded border bg-white text-slate-400">
                <Command size={10} className="inline mr-1" />K
              </kbd>

              {/* RESULTS */}
              {showSearchBox && search && (
                <div className="absolute top-14 left-0 w-full bg-white rounded-2xl border border-sky-100 shadow-xl z-50 overflow-hidden">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          navigate("/resources/portfolio");
                          setSearch(emp.name);
                          setShowSearchBox(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-sky-50 border-b last:border-none"
                      >
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.role}</p>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-400">
                      No employee found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="h-11 w-11 rounded-2xl bg-white border border-sky-100 flex items-center justify-center hover:bg-sky-50"
              >
                <Bell size={18} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-sky-100 shadow-xl z-50">
                  <div className="p-4 border-b font-semibold">
                    Notifications
                  </div>
                  <div className="p-4 text-sm text-slate-400">
                    No new alerts.
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 px-2 py-1.5 rounded-2xl bg-sky-500 text-white"
              >
                <div className="h-9 w-9 rounded-xl bg-white text-sky-600 flex items-center justify-center font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-[10px] uppercase font-bold">
                    {user.role}
                  </p>
                  <p className="text-xs font-semibold">
                    {user.email.split("@")[0]}
                  </p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold truncate">{user.email}</p>
                    <p className="text-xs text-sky-600 mt-1 uppercase font-bold">
                      {user.role}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/my-profile"
                      className="h-11 rounded-xl px-4 flex items-center hover:bg-sky-50 text-sm"
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full h-11 rounded-xl px-4 text-left hover:bg-rose-50 text-rose-600 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto p-8 bg-sky-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Chatbot />
    </div>
  );
}