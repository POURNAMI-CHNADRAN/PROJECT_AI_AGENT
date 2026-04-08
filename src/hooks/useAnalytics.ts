import { useEffect, useState } from "react";
import {
  fetchUtilization,
  fetchBench,
  fetchRevenue,
  fetchProjectHealth,
  fetchMoveSuggestions,
} from "../api/analyticsAPI";

const extract = (res: any) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export function useAnalytics(month: number, year: number) {
  const [loading, setLoading] = useState(true);

  const [utilization, setUtilization] = useState<any[]>([]);
  const [bench, setBench] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [projectHealth, setProjectHealth] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const [
          utilRes,
          benchRes,
          revRes,
          healthRes,
          suggestRes,
        ] = await Promise.all([
          fetchUtilization(month, year),
          fetchBench(month, year),
          fetchRevenue(month, year),
          fetchProjectHealth(month, year),
          fetchMoveSuggestions(),
        ]);

        console.log("UTIL RAW:", utilRes);
        console.log("BENCH RAW:", benchRes);

        if (!mounted) return;

        setUtilization(extract(utilRes));
        setBench(extract(benchRes));
        setRevenue(extract(revRes));
        setProjectHealth(extract(healthRes));
        setSuggestions(extract(suggestRes));

      } catch (err) {
        console.error("Analytics error:", err);

        setUtilization([]);
        setBench([]);
        setRevenue([]);
        setProjectHealth([]);
        setSuggestions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [month, year]);

  return {
    loading,
    utilization,
    bench,
    revenue,
    projectHealth,
    suggestions,
  };
}