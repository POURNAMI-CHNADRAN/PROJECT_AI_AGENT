import { Outlet, Link, useLocation } from "react-router";
import { LayoutGrid, Calendar, Users } from "lucide-react";
import { cn } from "./ui/utils";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Portfolio Dashboard", icon: LayoutGrid },
    { path: "/heatmap", label: "Heatmap Scheduler", icon: Calendar },
    { path: "/workload", label: "Workload Manager", icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-semibold">ResourceHub</h1>
          <p className="text-sm text-gray-400 mt-1">Planning Suite</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            <p>© 2026 ResourceHub</p>
            <p className="mt-1">Enterprise Planning System</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
