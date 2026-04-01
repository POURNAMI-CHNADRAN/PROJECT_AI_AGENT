export function AssignEmployeeModal({
  employee,
  month,
  year,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[420px] space-y-4">
        <h2 className="text-lg font-semibold">
          Assign {employee.name}
        </h2>

        <p className="text-sm text-gray-500">
          Assign employee to a project for {month ? `Month ${month}` : "a month"}, {year}
        </p>

        {/* FUTURE INPUTS */}
        {/* Project Select */}
        {/* Hours / FTE */}
        {/* Billable Toggle */}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
``