import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export function useResourceHeatmapData(month: number, year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${API}/api/employees`, { headers }).then(r => r.json()),
      fetch(`${API}/api/departments`, { headers }).then(r => r.json()),
      fetch(`${API}/api/allocations/month?month=${month}&year=${year}`, { headers }).then(r => r.json()),
    ])
      .then(([emps, deps, allocs]) => {
        setEmployees(emps || []);
        setDepartments(deps || []);
        setAllocations(allocs || []);
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  return { employees, departments, allocations, loading };
}
