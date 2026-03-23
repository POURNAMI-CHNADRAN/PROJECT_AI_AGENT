import { Plus, Edit, Trash2 } from "lucide-react";

const stories = [
  { title: "User Authentication System", points: 8, employee: "John Smith", project: "E-commerce Platform", status: "In Progress" },
  { title: "Shopping Cart Functionality", points: 5, employee: "Sarah Johnson", project: "E-commerce Platform", status: "Completed" },
  { title: "Payment Gateway Integration", points: 13, employee: "Michael Chen", project: "E-commerce Platform", status: "To Do" },
  { title: "Dashboard Redesign", points: 8, employee: "Emily Davis", project: "Mobile App Redesign", status: "In Progress" },
  { title: "Data Visualization Components", points: 5, employee: "Robert Wilson", project: "Data Analytics Dashboard", status: "Completed" },
  { title: "API Development", points: 8, employee: "John Smith", project: "Cloud Migration", status: "In Progress" },
];

export default function Stories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-neutral-800">Story Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded text-sm hover:bg-neutral-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>

      {/* Stories Table */}
      <div className="bg-white border-2 border-neutral-300 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b-2 border-neutral-300">
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Story Title</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Story Points</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Assigned Employee</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Project</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Status</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story, index) => (
              <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="px-6 py-3 text-sm text-neutral-800">{story.title}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{story.points}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{story.employee}</td>
                <td className="px-6 py-3 text-sm text-neutral-600">{story.project}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    story.status === 'Completed' 
                      ? 'bg-neutral-200 text-neutral-800' 
                      : story.status === 'In Progress'
                      ? 'bg-neutral-300 text-neutral-800'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {story.status}
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
