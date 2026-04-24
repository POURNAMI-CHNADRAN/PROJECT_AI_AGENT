import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  role: "Admin" | "Finance" | "Employee";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

useEffect(() => {
  const initAuth = async () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      setLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  // ✅ LOGIN
const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return false;

    const loggedUser = data.user || data;

    setUser(loggedUser);
    setToken(data.token);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return true;
  } catch (err) {
  console.error("Login Error:", err);
  return false;
}
};

  // ✅ LOGOUT (ONLY HERE)
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
