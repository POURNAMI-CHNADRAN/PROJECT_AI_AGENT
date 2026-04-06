
import {
  X,
  Calendar,
  MapPin,
  Briefcase,
  ArrowRightLeft,
  Edit3,
} from "lucide-react";

interface EmployeeDrawerProps {
  employee: any;
  onClose: () => void;
}

export default function EmployeeDrawer({
  employee,
  onClose,
}: EmployeeDrawerProps) {
  const CAPACITY = 160;
  const booked = employee.totalFTE || 0;
  const utilizationPct = Math.round((booked / CAPACITY) * 100);

  const utilizationLabel =
    booked < CAPACITY
      ? "Underutilized"
      : booked === CAPACITY
      ? "Optimal"
      : "Overallocated";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-[420px] bg-white shadow-xl h-full flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {employee.name}
            </h2>
            <p className="text-sm text-gray-500">
              {employee.employeeId} ·{" "}
              {employee.workCategoryName || "Unassigned"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* ===== Employee Info ===== */}
          <Section title="Employee Info">
            <InfoRow
              icon={<Calendar size={14} />}
              label="Joining Date"
              value={new Date(
                employee.joiningDate
              ).toLocaleDateString()}
            />
            <InfoRow
              icon={<Briefcase size={14} />}
              label="Experience"
              value={`${employee.experience || 0} yrs`}
            />
            <InfoRow
              icon={<MapPin size={14} />}
              label="Location"
              value={employee.location || "—"}
            />
          </Section>

          {/* ===== Capacity ===== */}
          <Section title="Capacity">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Monthly Utilization
                </span>
                <span className="font-medium">
                  {utilizationLabel}
                </span>
              </div>

              <div className="text-xl font-semibold">
                {booked}h / {CAPACITY}h
              </div>

              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    utilizationPct < 100
                      ? "bg-yellow-400"
                      : utilizationPct === 100
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      utilizationPct,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="text-xs text-gray-500">
                {utilizationPct}%
              </div>
            </div>
          </Section>

          {/* ===== Current Allocation ===== */}
          <Section title="Current Allocation">
            {employee.allocations?.length ? (
              <div className="space-y-3">
                {employee.allocations.map((a: any) => (
                  <div
                    key={a._id}
                    className="border rounded-lg p-3"
                  >
                    <div className="font-medium text-gray-900">
                      {a.project?.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.fte || a.allocation}h ·{" "}
                      {a.isBillable
                        ? "Billable"
                        : "Non‑Billable"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-3 text-sm">
                No active allocations — employee is on bench.
              </div>
            )}
          </Section>

          {/* ===== Actions ===== */}
          {(employee.role === "Admin" ||
            employee.role === "Finance") && (
            <Section title="Actions">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
                  <ArrowRightLeft size={16} />
                  Move Project
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                  <Edit3 size={16} />
                  Edit Monthly FTE
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-sky-700 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm mb-2">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        {label}
      </div>
      <div className="font-medium text-gray-900">
        {value}
      </div>
    </div>
  );
}
