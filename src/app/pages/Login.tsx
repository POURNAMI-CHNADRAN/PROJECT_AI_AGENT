import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) throw new Error("Invalid credentials");

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      navigate(
        user.role === "Employee" ? "/my-profile" : "/dashboard",
        { replace: true }
      );
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden relative bg-slate-50">

      {/* 🔥 GLOBAL ANIMATED GRADIENT */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, #e0f2fe, transparent 40%), radial-gradient(circle at 80% 70%, #bae6fd, transparent 40%)",
            "radial-gradient(circle at 30% 40%, #dbeafe, transparent 45%), radial-gradient(circle at 70% 60%, #93c5fd, transparent 45%)",
            "radial-gradient(circle at 20% 30%, #e0f2fe, transparent 40%), radial-gradient(circle at 80% 70%, #bae6fd, transparent 40%)",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* LEFT PANEL */}
      <motion.div
        className="hidden lg:flex w-[55%] relative overflow-hidden"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 🌫️ PARALLAX LIGHT BLOBS */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-300/30 blur-[120px] rounded-full"
          animate={{ x: [0, 60, 0], y: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/30 blur-[140px] rounded-full"
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 26, repeat: Infinity }}
        />

        {/* ✨ NOISE */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative z-10 flex flex-col items-center justify-between px-16 py-10 w-full">

          {/* LOGO */}
          <motion.img
            src="/LOGO_COPY.png"
            className="w-82 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* TEXT */}
          <motion.div
            className="text-center max-w-lg space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-3xl font-bold text-slate-900"
            >
              Optimize Your Workforce 🚀
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-600 text-lg"
            >
              Plan Smarter. Allocate Better. Maximize Utilization.
            </motion.p>

            {/* 📊 CHART */}
            <motion.div
              className="relative h-48 mt-6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg viewBox="0 0 400 200" className="w-full h-full">

                {[40, 90, 140, 190, 240, 290, 340].map((x, i) => {
                  const heights = [60, 90, 110, 80, 120, 95, 70];
                  return (
                    <motion.rect
                      key={i}
                      x={x}
                      width="26"
                      rx="8"
                      fill="#0ea5e9"
                      initial={{ height: 0, y: 200 }}
                      animate={{
                        height: heights[i],
                        y: 200 - heights[i],
                      }}
                      transition={{
                        delay: 0.7 + i * 0.08,
                        type: "spring",
                        stiffness: 140,
                        damping: 14,
                      }}
                    />
                  );
                })}

                <motion.path
                  d="M 55 150 Q 105 120, 155 90 T 255 80 T 355 140"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.6, duration: 1.2 }}
                />

                <motion.circle
                  cx="255"
                  cy="80"
                  r="6"
                  fill="#0ea5e9"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* FOOTER */}
          <motion.div
            className="flex items-center gap-3 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Shield size={16} />
            Secure • Enterprise Ready • GDPR
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] p-12 hover:shadow-[0_40px_100px_rgba(0,0,0,0.2)] transition">

            <h2 className="text-3xl font-bold text-center mb-6">
              Welcome Back 👋
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <SSO type="google" />
              <SSO type="microsoft" />
            </div>

            <Divider />

            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={Mail} value={email} onChange={setEmail} placeholder="Email" />
              <Field
                icon={Lock}
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={setPassword}
                placeholder="Password"
                endIcon={
                  showPassword
                    ? <EyeOff onClick={() => setShowPassword(false)} />
                    : <Eye onClick={() => setShowPassword(true)} />
                }
              />

              <button
                className="
                  relative w-full py-3.5 rounded-xl font-semibold text-white
                  overflow-hidden group

                  bg-gradient-to-r from-sky-600 via-sky-600 to-sky-600
                  shadow-[0_10px_30px_rgba(37,99,235,0.35)]

                  transition-all duration-300 ease-out
                  hover:shadow-[0_14px_40px_rgba(37,99,235,0.45)]
                  hover:-translate-y-[1px]
                  active:translate-y-[1px] active:shadow-md
                "
              >
                {/* Soft Top Glow */}
                <span
                  className="
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition duration-500
                    bg-[radial-gradient(circle_at_50%_0%,rgba(255, 255, 255, 0),transparent_60%)]
                  "
                />

                {/* Shimmer Sweep */}
                <span
                  className="
                    absolute inset-0 -translate-x-full group-hover:translate-x-full
                    transition-transform duration-700 ease-out
                    bg-gradient-to-r from-transparent via-white/30 to-transparent
                  "
                />

                {/* Inner Glass Highlight */}
                <span
                  className="
                    absolute inset-[1px] rounded-xl
                    bg-gradient-to-b from-white/10 to-transparent
                    pointer-events-none
                  "
                />

                {/* CONTENT */}
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Enter Workspace"
                  )}
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Field({ icon: Icon, endIcon, ...props }: any) {
  return (
    <motion.div whileFocus={{ scale: 1.01 }} className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        onChange={(e: any) => props.onChange(e.target.value)}
        className="w-full pl-12 pr-12 py-3 bg-white/70 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none transition"
      />
      {endIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">{endIcon}</div>}
    </motion.div>
  );
}

function SSO({ type }: any) {
  const isGoogle = type === "google";

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl bg-white/60 backdrop-blur hover:shadow-lg transition"
    >
      {isGoogle ? (
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 21 21">
          <path fill="#f25022" d="M0 0h10v10H0z"/>
          <path fill="#7fba00" d="M11 0h10v10H11z"/>
          <path fill="#00a4ef" d="M0 11h10v10H0z"/>
          <path fill="#ffb900" d="M11 11h10v10H11z"/>
        </svg>
      )}
      Continue with {isGoogle ? "Google" : "Microsoft"}
    </motion.button>
  );
}

function Divider() {
  return (
    <div className="relative my-4">
      <div className="border-t border-slate-200" />
      <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-xs text-slate-400">
        OR
      </span>
    </div>
  );
}