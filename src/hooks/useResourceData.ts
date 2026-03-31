import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export function useResourceData(month: number, year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/employees`, { headers }).then(r => r.json()),
      fetch(`${API}/api/projects`, { headers }).then(r => r.json()),
      fetch(`${API}/api/billing?month=${month}&year=${year}`, { headers }).then(r => r.json()),
    ])
      .then(([emp, proj, rev]) => {
        setEmployees(emp);
        setProjects(proj);
        setRevenues(rev.data || rev);
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  return { employees, projects, revenues, loading };
}