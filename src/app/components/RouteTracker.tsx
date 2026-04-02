import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // ✅ Never store login route
    if (location.pathname !== "/login") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location.pathname]);

  return null;
}
