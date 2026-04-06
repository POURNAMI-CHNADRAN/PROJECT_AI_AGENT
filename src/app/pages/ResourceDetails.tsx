import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ResourceDetails() {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [emp, setEmp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load employee");

        const data = await res.json();

        // ✅ normalize response safely
        setEmp({
          ...data,
          allocations: data?.allocations ?? [],
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 text-sky-700 animate-pulse">
        Loading resource profile...
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !emp) {
    return (
      <div className="p-6 text-red-600">
        Failed to load resource details
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-sky-50">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-sky-900">
        {emp.name || "N/A"} ({emp.employeeId || "N/A"})
      </h1>

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow">
        <div>
          <b>Joining Date:</b>{" "}
          {emp.joiningDate ? new Date(emp.joiningDate).toDateString() : "N/A"}
        </div>

        <div>
          <b>Experience:</b> {emp.experience ?? "N/A"} yrs
        </div>

        <div>
          <b>Rate/Finance:</b> ₹{emp.ratePerHour ?? "N/A"}
        </div>

        <div>
          <b>Total FTE:</b> {emp.totalFTE ?? 0} / 160
        </div>

        <div>
          <b>Status:</b> {emp.utilizationStatus || "N/A"}
        </div>

        <div>
          <b>Work Category:</b> {emp.workCategory || "N/A"}
        </div>
      </div>

      {/* ALLOCATIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Project Allocations
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-sky-100">
            <tr>
              <th className="p-2 text-left">Project</th>
              <th className="text-center">FTE (hrs)</th>
              <th className="text-center">Billable</th>
            </tr>
          </thead>

          <tbody>
            {emp.allocations.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-4 text-gray-500"
                >
                  No allocations found
                </td>
              </tr>
            ) : (
              emp.allocations.map((a: any) => (
                <tr key={a._id} className="border-b">
                  <td className="p-2">
                    {a.project?.name || "N/A"}
                  </td>

                  <td className="text-center">
                    {a.fte ?? 0}
                  </td>

                  <td className="text-center">
                    {a.isBillable ? "Billable" : "Non-Billable"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}