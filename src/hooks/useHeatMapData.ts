import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export function useResourceHeatmapData(year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);

    Promise.all([
      fetch(`${API}/api/employees`, { headers }).then(r => r.json()),
      fetch(`${API}/api/departments`, { headers }).then(r => r.json()),
      fetch(`${API}/api/allocations/year?year=${year}`, { headers }).then(r =>
        r.json()
      ),
    ])
      .then(([emps, depts, allocs]) => {
        setEmployees(Array.isArray(emps) ? emps : []);
        setDepartments(Array.isArray(depts) ? depts : []);
        setAllocations(Array.isArray(allocs) ? allocs : []);
      })
      .finally(() => setLoading(false));
  }, [year]);

  return { employees, departments, allocations, loading };
}