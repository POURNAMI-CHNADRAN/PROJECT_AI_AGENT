export function MonthCell({
  cell,
  month,
  isBench,
  onAssign,
}: any) {

  if (cell.hours === 0 && isBench) {
    return (
      <div
        className="w-40 border-r p-3 text-center cursor-pointer hover:bg-blue-50"
        onClick={onAssign}
      >
        <div className="text-xs text-blue-500">Assign</div>
      </div>
    );
  }

  return (
    <div className="w-40 border-r p-3 text-center">
      {cell.hours > 0 ? (
        <>
          <div className="text-sm font-medium">{cell.hours}h</div>
          <div className="text-xs text-green-600">
            ₹{cell.billableAmount.toLocaleString()}
          </div>
        </>
      ) : (
        <div className="text-xs text-gray-300">—</div>
      )}
    </div>
  );
}