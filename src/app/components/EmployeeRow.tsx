import { MonthCell } from "../components/MonthCell";

interface EmployeeRowProps {
  employee: any;
  months: { month: number; label: string }[];
  monthlyData: any[];
  onAssign: (month: number | null) => void;
}


export function EmployeeRow({
  employee,
  months,
  monthlyData,
  onAssign,
}: EmployeeRowProps) {
  const isBench = monthlyData.every((m: any) => m.hours === 0);

  return (
    <div className={`flex border-b ${isBench ? "bg-yellow-50" : ""}`}>
      {/* EMPLOYEE META */}
      <div className="w-64 p-3 border-r">
        <div className="font-medium flex items-center gap-2">
          {employee.name}
          {isBench && (
            <span className="text-xs bg-yellow-200 px-2 rounded">
              Bench
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500">
          {employee.departmentId?.name}
        </div>

        {isBench && (
          <button
            className="mt-1 text-xs text-blue-600 underline"
            onClick={() => onAssign(null)}
          >
            Assign to Project
          </button>
        )}
      </div>

      {/* MONTH CELLS */}
      {monthlyData.map((cell: any, idx: number) => (
        <MonthCell
          key={idx}
          cell={cell}
          month={months[idx].month}
          isBench={isBench}
          onAssign={() => onAssign(months[idx].month)}
        />
      ))}
    </div>
  );
}