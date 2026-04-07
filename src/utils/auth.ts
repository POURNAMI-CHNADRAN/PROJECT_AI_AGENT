export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function canEditEmployee() {
  const user = getCurrentUser();
  return user?.role === "Admin" || user?.role === "Finance";
}