export default function WorkloadTimeline({ data }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <h2 className="font-semibold mb-4">Workload Timeline</h2>

      {data.map((emp: any) => (
        <div key={emp._id} className="mb-4">

          <p className="text-sm font-medium mb-1">{emp.name}</p>

          <div className="relative h-6 bg-gray-100 rounded">

            {emp.allocations.map((a: any) => (
              <div
                key={a._id}
                className="absolute h-6 bg-sky-500 rounded text-xs text-white flex items-center justify-center"
                style={{
                  left: `${a.start}%`,
                  width: `${a.width}%`,
                }}
              >
                {a.project}
              </div>
            ))}

          </div>
        </div>
      ))}
    </div>
  );
}