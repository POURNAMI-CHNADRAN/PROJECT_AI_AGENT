export default function AIControlPanel({ suggestions }: any) {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-2xl">

      <h2 className="font-semibold mb-4">AI Optimization Engine 🤖</h2>

      {suggestions.map((s: any) => (
        <div key={s.id} className="bg-white p-4 rounded-lg mb-3 shadow-sm">

          <p className="text-sm">{s.message}</p>

          <button className="mt-2 px-3 py-1 text-sm bg-sky-600 text-white rounded">
            Apply Fix
          </button>

        </div>
      ))}
    </div>
  );
}