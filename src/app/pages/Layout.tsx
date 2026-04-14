import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-100">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 p-4 flex flex-col">
        {/* LOGO_COPY */}
        <div className="mb-6 flex justify-center">
          <img src="/LOGO_COPY.png" className="h-16 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <a href="/dashboard" className="block p-2 hover:bg-neutral-100 rounded">Dashboard</a>
          <a href="/employees" className="block p-2 hover:bg-neutral-100 rounded">Employees</a>
          <a href="/departments" className="block p-2 hover:bg-neutral-100 rounded">Departments</a>
          {/* Add more links */}
        </nav>

        <div className="mt-auto">
          <button className="w-full py-2 px-4 bg-neutral-900 text-white rounded">Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md w-64"
          />
          <div className="flex items-center gap-4">
            <span>🔔</span>
            <span>👤</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}