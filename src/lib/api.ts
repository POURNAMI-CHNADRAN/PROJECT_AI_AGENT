const API = import.meta.env.VITE_API_BASE_URL;

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API}${url}`, { headers: headers() });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

export async function apiPatch<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}