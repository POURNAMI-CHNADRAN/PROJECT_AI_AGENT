import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";

interface HeatmapState {
  employees: any[];
  allocations: any[];
  loading: boolean;
  error: string | null;
}

function normalizeArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export default function useResourceHeatmapData(year: number): HeatmapState {
  const [employees, setEmployees] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

        const [empRes, allocRes] = await Promise.all([
          axios.get(`${API}/api/employees`, { headers }),
          axios.get(`${API}/api/allocations`, {
            headers,
            params: { year },
          }),
        ]);

        const employeesData = normalizeArray(empRes.data);

        // ✅ Normalize employeeId (CRITICAL FIX)
        const allocationsData = normalizeArray(allocRes.data).map((a: any) => ({
          ...a,
          employeeId:
            typeof a.employeeId === "object"
              ? a.employeeId._id
              : a.employeeId,
        }));

        setEmployees(employeesData);
        setAllocations(allocationsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load heatmap data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return { employees, allocations, loading, error };
}