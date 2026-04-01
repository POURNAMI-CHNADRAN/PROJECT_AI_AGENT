import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export function useResourceData(month: number, year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, deptRes, projRes, revRes] = await Promise.all([
        fetch(`${API}/api/employees`, { headers }).then(r => r.json()),
        fetch(`${API}/api/departments`, { headers }).then(r => r.json()),
        fetch(`${API}/api/projects`, { headers }).then(r => r.json()),
        month && year
          ? fetch(`${API}/api/billing?month=${month}&year=${year}`, { headers }).then(r => r.json())
          : Promise.resolve([]),
      ]);

      setEmployees(empRes || []);
      setDepartments(deptRes || []);
      setProjects(projRes || []);
      setRevenues(revRes?.data || revRes || []);
    } finally {
      setLoading(false);
    }
  }, [API, month, year, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    employees,
    departments, 
    projects,
    revenues,
    loading,
    refetch: fetchData,
  };
}