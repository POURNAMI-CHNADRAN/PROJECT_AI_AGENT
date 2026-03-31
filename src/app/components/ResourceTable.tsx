import { StatusBadge } from "./StatusBadge";

export function ResourceTable({ employees, onSelect }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th>Category</th>
            <th>Rate</th>
            <th>Projects</th>
            <th>Utilization</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((e: any) => {
            const percent = (e.totalFTE / 160) * 100;

            return (
              <tr
                key={e._id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(e)}
              >
                {/* EMP */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sky-200 rounded-full flex items-center justify-center">
                      {e.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-gray-500">{e.employeeId}</div>
                    </div>
                  </div>
                </td>

                <td>{e.workCategory}</td>
                <td>₹{e.ratePerHour}</td>

                <td className="text-sky-600 truncate max-w-xs">
                  {e.allocations?.map((a: any) => a.project.name).join(", ")}
                </td>

                {/* UTIL */}
                <td>
                  <div className="w-full bg-gray-100 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        percent > 100
                          ? "bg-red-500"
                          : percent > 75
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </td>

                <td>
                  <StatusBadge status={e.utilizationStatus} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}