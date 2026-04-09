import React from "react";

export default function Heatmap({ data }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm overflow-auto">

      <h2 className="font-semibold mb-4">Portfolio Heatmap</h2>

      <div className="min-w-[800px]">
        {/* HEADER */}
        <div className="grid grid-cols-8 text-xs text-gray-500 mb-2">
          <div>Employee</div>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="text-center">Day {i + 1}</div>
          ))}
        </div>

        {/* ROWS */}
        {data.map((emp: any) => (
          <div key={emp._id} className="grid grid-cols-8 mb-2 items-center">

            <div className="text-sm font-medium">{emp.name}</div>

            {emp.days.map((h: number, i: number) => {
              let color =
                h === 0
                  ? "bg-gray-100"
                  : h < 6
                  ? "bg-green-300"
                  : h < 8
                  ? "bg-yellow-300"
                  : "bg-red-400";

              return (
                <div
                  key={i}
                  className={`h-6 mx-1 rounded ${color}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}