import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// API base resolution (Vite / CRA)
let API_BASE = "http://localhost:5000";
try {
  // @ts-ignore
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    // @ts-ignore
    API_BASE = import.meta.env.VITE_API_BASE_URL;
  } else if (process.env.REACT_APP_API_BASE_URL) {
    API_BASE = process.env.REACT_APP_API_BASE_URL;
  }
} catch {}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Invalid Email or Password");

      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      if (data?.user?.role === "Employee") {
        navigate("/my-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 LIGHT SKY BLUE THEME (NO GRADIENT)
  const styles = {
    root: {
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "#e0f2fe", // light sky blue
      color: "#0f172a",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
    } as React.CSSProperties,

    card: {
      width: "100%",
      maxWidth: 420,
      background: "#ffffff",
      border: "1px solid #dbeafe", // light sky border
      borderRadius: 16,
      padding: 28,
      boxShadow: "0 8px 20px rgba(2,6,23,0.08)",
    } as React.CSSProperties,

    logo: {
      display: "block",
      width: 120,
      height: "auto",
      margin: "4px auto 16px",
      userSelect: "none",
    } as React.CSSProperties,

    title: {
      fontSize: 22,
      lineHeight: 1.2,
      fontWeight: 700,
      textAlign: "center" as const,
      margin: "6px 0 4px",
      color: "#0c4a6e", // dark sky-blue
    },

    subtitle: {
      color: "#1e3a8a",
      textAlign: "center" as const,
      fontSize: 14,
      marginBottom: 18,
    },

    error: {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fca5a5",
      padding: "10px 12px",
      borderRadius: 10,
      fontSize: 14,
      marginBottom: 12,
    },

    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#0c4a6e",
      marginBottom: 8,
    },

    inputWrap: { position: "relative" as const },

    inputBase: {
      width: "100%",
      padding: "12px 44px 12px 40px",
      border: "1px solid #93c5fd", // sky-300 border
      borderRadius: 12,
      background: "#ffffff",
      color: "#0f172a",
      outline: "none",
      transition: "all 140ms ease",
      fontSize: 14,
    },

    inputFocused: {
      borderColor: "#0284c7",
      boxShadow: "0 0 0 4px rgba(2,132,199,0.25)", // sky-blue glow
    },

    icon: {
      position: "absolute" as const,
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#0ea5e9", // sky-500
      pointerEvents: "none" as React.CSSProperties["pointerEvents"],
    },

    toggle: {
      position: "absolute" as const,
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      height: 28,
      width: 28,
      background: "transparent",
      borderRadius: 8,
      display: "grid",
      placeItems: "center",
      color: "#0ea5e9",
      cursor: "pointer",
    },

    button: {
      width: "100%",
      marginTop: 8,
      padding: "12px 16px",
      borderRadius: 12,
      border: "none",
      background: "#0ea5e9", // sky-blue button
      color: "#fff",
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 8px 16px rgba(14,165,233,0.25)",
    },

    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      boxShadow: "none",
    },

    footer: {
      marginTop: 14,
      textAlign: "center" as const,
      fontSize: 13,
    },

    link: { color: "#0284c7", textDecoration: "none" },
  };

  const Spinner = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 50 50"
      style={{ marginRight: 8, verticalAlign: "-3px" }}
      aria-hidden="true"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="4"
      />
      <path d="M25 5 a20 20 0 0 1 0 40" fill="none" stroke="#fff" strokeWidth="4">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <img src="/LOGO.png" alt="Logo" style={styles.logo} />

        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Continue to your Dashboard</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <label style={styles.label}>Email</label>
          <div style={styles.inputWrap}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m22 8-10 6L2 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused((f) => ({ ...f, email: true }))}
              onBlur={() => setFocused((f) => ({ ...f, email: false }))}
              required
              style={{
                ...styles.inputBase,
                ...(focused.email ? styles.inputFocused : {}),
              }}
            />
          </div>

          {/* Password */}
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <span style={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="10"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M7 10V7a5 5 0 1 1 10 0v3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused((f) => ({ ...f, password: true }))}
              onBlur={() => setFocused((f) => ({ ...f, password: false }))}
              required
              style={{
                ...styles.inputBase,
                ...(focused.password ? styles.inputFocused : {}),
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={styles.toggle}
            >
              {showPassword ? (
                /* Eye-off */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3l18 18M10.58 10.58a2 2 0 0 0 2.84 2.84"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M2 12s2.5 7 10 7 10-7 10-7-3.5-7-10-7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              ) : (
                /* Eye */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/forgot-password" style={styles.link}>
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}