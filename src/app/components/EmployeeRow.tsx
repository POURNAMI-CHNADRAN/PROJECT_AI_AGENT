export function EmployeeRow({
  employee,
  monthlyData,
  onAssign,
}: any) {
  return (
    <div className="flex border-b hover:bg-gray-50">
      
      <div className="w-64 p-3 border-r font-medium">
        {employee.name}
      </div>

      {monthlyData.map((m: any) => (
        <div
          key={m.month}
          onClick={() => onAssign(m.month)}
          className={`w-40 p-3 text-center border-r cursor-pointer ${m.color}`}
        >
          {m.totalHours > 0 ? (
            <>
              <div className="font-semibold">{m.totalHours}h</div>
              <div className="text-xs">{m.billableHours} billable</div>
              <div className="text-xs">{m.utilization}%</div>
            </>
          ) : (
            <div className="text-xs">—</div>
          )}
        </div>
      ))}
    </div>
  );
}