// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// export default API;

import axios from "axios";

/* ================= BASE URL ================= */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🔥 TOKEN SENT:", token); // DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("❌ Unauthorized - Redirecting");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;