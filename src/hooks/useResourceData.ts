import { useCallback, useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

type ApiResponse<T> = T[] | { data: T[] };

export function useResourceData(month: number, year: number) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [workCategories, setWorkCategories] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const normalize = <T,>(res: ApiResponse<T>): T[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  const safeFetch = async <T,>(url: string): Promise<T[]> => {
    const res = await fetch(url, {
      headers,
      signal: abortRef.current?.signal,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return normalize<T>(await res.json());
  };

  const fetchAll = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const [
        empData,
        deptData,
        projData,
        wcData,
        revData,
      ] = await Promise.all([
        safeFetch<any>(`${API}/api/employees?month=${month}&year=${year}`),
        safeFetch<any>(`${API}/api/departments`),
        safeFetch<any>(`${API}/api/projects`),
        safeFetch<any>(`${API}/api/workcategories`),
        month && year
          ? safeFetch<any>(`${API}/api/billing?month=${month}&year=${year}`)
          : Promise.resolve([]),
      ]);

      setEmployees(empData);
      setDepartments(deptData);
      setProjects(projData);
      setWorkCategories(wcData);
      setRevenues(revData);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Resource fetch failed:", err);
        setError("Failed to load resource data");
      }
    } finally {
      setLoading(false);
    }
  }, [API, month, year, token]);

  const refetchEmployees = useCallback(async () => {
    if (!token) return;

    try {
      const empData = await safeFetch<any>(
        `${API}/api/employees?month=${month}&year=${year}`
      );
      setEmployees(empData);
    } catch (err) {
      if ((err as any).name !== "AbortError") {
        console.error("Failed to refetch employees", err);
      }
    }
  }, [API, month, year, token]);

  useEffect(() => {
    fetchAll();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchAll]);

  return {
    employees,
    departments,
    projects,
    workCategories,
    revenues,
    loading,
    error,
    refetchEmployees,
    refetchAll: fetchAll,
  };
}