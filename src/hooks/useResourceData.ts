import { useCallback, useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export function useResourceData(month: number, year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [workCategories, setWorkCategories] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const mountedRef = useRef(true);

  const headers = { Authorization: `Bearer ${token}` };

  const normalize = (res: any): any[] => {
    if (Array.isArray(res)) return [...res];
    if (Array.isArray(res?.data)) return [...res.data];
    return [];
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);

    try {
      const [
        empRes,
        deptRes,
        projRes,
        wcRes,
        revRes,
      ] = await Promise.all([
        fetch(
          `${API}/api/employees?month=${month}&year=${year}`,
          { headers }
        ).then((r) => r.json()),
        fetch(`${API}/api/departments`, { headers }).then((r) =>
          r.json()
        ),
        fetch(`${API}/api/projects`, { headers }).then((r) =>
          r.json()
        ),
        fetch(`${API}/api/workcategories`, { headers }).then(
          (r) => r.json()
        ),
        month && year
          ? fetch(
              `${API}/api/billing?month=${month}&year=${year}`,
              { headers }
            ).then((r) => r.json())
          : Promise.resolve([]),
      ]);

      if (!mountedRef.current) return;

      setEmployees(normalize(empRes));
      setDepartments(normalize(deptRes));
      setProjects(normalize(projRes));
      setWorkCategories(normalize(wcRes));
      setRevenues(normalize(revRes));
    } catch (err) {
      console.error("Failed to load resources", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [API, month, year, token]);

  const refetchEmployees = useCallback(async () => {
    const empRes = await fetch(
      `${API}/api/employees?month=${month}&year=${year}`,
      { headers }
    ).then((r) => r.json());

    if (!mountedRef.current) return;
    setEmployees(normalize(empRes));
  }, [API, month, year, token]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchAll]);

  return {
    employees,
    departments,
    projects,
    workCategories,
    revenues,
    loading,
    refetchEmployees,
    refetchAll: fetchAll,
  };
}