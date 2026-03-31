import { useState } from "react";
import { apiPatch } from "../../lib/api";
import { useResourceData } from "../../hooks/useResourceData";

export function WorkloadManager() {
  const { employees } = useResourceData(3, 2026);
  const [selected, setSelected] = useState<any>(null);

  const save = async (empId: string) => {
    await apiPatch(`/api/tasks/${selected._id}/reassign`, {
      assigneeId: empId,
    });
    setSelected(null);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      {employees.map(emp => (
        <div key={emp._id} className="flex justify-between">
          <span>{emp.name}</span>
          <span>{Math.round((emp.totalFTE / 160) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}