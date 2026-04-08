import api from "./api";

/* ================= ANALYTICS APIS ================= */

export const fetchUtilization = (month: number, year: number) =>
  api.get("/utilization", { params: { month, year } });

export const fetchBench = (month: number, year: number) =>
  api.get("/bench", { params: { month, year } });

export const fetchRevenue = (month: number, year: number) =>
  api.get("/revenue", { params: { month, year } });

export const fetchProjectHealth = (month: number, year: number) =>
  api.get("/projects/health", { params: { month, year } });

export const fetchMoveSuggestions = () =>
  api.get("/suggestions/moves");