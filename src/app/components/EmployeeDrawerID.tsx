import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeDrawer from "./EmployeeDrawer";

const API = import.meta.env.VITE_API_BASE_URL;

interface EmployeeDrawerByIdProps {
  employeeId: string;
  onClose: () => void;
}

export default function EmployeeDrawerID({
  employeeId,
  onClose,
}: EmployeeDrawerByIdProps) {
  const [employee, setEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadEmployee() {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (mounted) setEmployee(res.data?.data);
      } catch (err) {
        console.error("Failed to load employee", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEmployee();
    return () => {
      mounted = false;
    };
  }, [employeeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 text-white">
        Loading Employee…
      </div>
    );
  }

  if (!employee) return null;

    return (
    <EmployeeDrawer
        employee={employee}
        canEdit={true}
        projects={employee.projects || []}
        workCategories={employee.workCategories || []}
        refetchEmployees={() => {}}
        onClose={onClose}
    />
    );
}