import { Plus, Edit, Trash2 } from "lucide-react";

const projects = [
  { name: "E-commerce Platform", client: "TechCorp Inc", billingModel: "Fixed Price", startDate: "2026-01-15", endDate: "2026-06-30", status: "Active" },
  { name: "Mobile App Redesign", client: "RetailMax Group", billingModel: "Time & Material", startDate: "2026-02-01", endDate: "2026-05-15", status: "Active" },
  { name: "Data Analytics Dashboard", client: "FinanceHub Ltd", billingModel: "Fixed Price", startDate: "2025-11-01", endDate: "2026-03-31", status: "Active" },
  { name: "Cloud Migration", client: "HealthPlus Systems", billingModel: "Time & Material", startDate: "2026-01-20", endDate: "2026-08-30", status: "Active" },
  { name: "Learning Management System", client: "EduLearn Platform", billingModel: "Fixed Price", startDate: "2025-12-01", endDate: "2026-04-15", status: "Completed" },
];

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-neutral-800">Project Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Project Name</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Client</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Billing Model</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Start Date</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">End Date</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Status</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{project.name}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{project.client}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{project.billingModel}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{project.startDate}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{project.endDate}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'Active' 
                      ? 'bg-neutral-200 text-neutral-800' 
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Edit className="w-4 h-4 text-neutral-600" />
                    </button>
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Trash2 className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
