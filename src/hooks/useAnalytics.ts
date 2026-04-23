import { useEffect, useState } from "react";
import {
  fetchUtilization,
  fetchBench,
  fetchRevenue,
  fetchProjectHealth,
  fetchMoveSuggestions,
} from "../api/analyticsAPI";

const extract = (res: any) => {
  const data = res?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;

  if (data && typeof data === "object") {
    const firstArray = Object.values(data).find(Array.isArray);
    if (firstArray) return firstArray;
  }

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

        // DEBUG LOGS
        console.log("UTIL:", utilRes.data);
        console.log("BENCH:", benchRes.data);
        console.log("REV:", revRes.data);
        console.log("HEALTH:", healthRes.data);
        console.log("SUGGEST:", suggestRes.data);

        if (!mounted) return;

        setUtilization(extract(utilRes));
        setBench(extract(benchRes));
        setRevenue(extract(revRes));
        setProjectHealth(extract(healthRes));
        setSuggestions(extract(suggestRes));

      } catch (err) {
        console.error("Analytics error:", err);

        if (mounted) {
          setUtilization([]);
          setBench([]);
          setRevenue([]);
          setProjectHealth([]);
          setSuggestions([]);
        }
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