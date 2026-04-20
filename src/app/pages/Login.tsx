import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from "lucide-react";

const ROTATING_TEXTS = [
  { prefix: "Utilization,", highlight: "Solved." },
  { prefix: "Bench,", highlight: "Eliminated." },
  { prefix: "Allocation,", highlight: "Automated." },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);

  // Rotating Headline Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login Failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(
      data.user.role === "Employee" ? "/my-profile" : "/dashboard",
      { replace: true }
    );
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen w-full flex overflow-hidden relative bg-white font-sans">
      
      {/* --- GLOBAL ANIMATED GRADIENT --- */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, #f0f9ff, transparent 40%), radial-gradient(circle at 80% 70%, #e0f2fe, transparent 40%)",
            "radial-gradient(circle at 30% 40%, #f8fafc, transparent 45%), radial-gradient(circle at 70% 60%, #f1f5f9, transparent 45%)",
            "radial-gradient(circle at 20% 30%, #f0f9ff, transparent 40%), radial-gradient(circle at 80% 70%, #e0f2fe, transparent 40%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

        {/* --- LEFT SIDE: THE TECH EXPERIENCE --- */}
        <motion.div
        className="hidden lg:flex w-[55%] border-r border-slate-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
        <div className="w-full h-full flex flex-col items-center justify-center px-20 py-16">

            {/* INNER WRAPPER (controls spacing perfectly) */}
            <div className="w-full max-w-xl flex flex-col items-center text-center">

            {/* LOGO */}
            <div className="mb-10">
                <img 
                src="/LOGO_COPY.png" 
                className="h-16 md:h-20 lg:h-30 opacity-90"
                />
            </div>

            {/* TEXT */}
            <div className="mb-10">
                <div className="h-[120px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h1
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight"
                    >
                    {ROTATING_TEXTS[index].prefix}
                    <span className="block bg-gradient-to-r from-sky-700 via-sky-500 to-sky-700 bg-clip-text text-transparent">
                        {ROTATING_TEXTS[index].highlight}
                    </span>
                    </motion.h1>
                </AnimatePresence>
                </div>

                <p className="mt-4 text-slate-500 text-lg font-medium max-w-md mx-auto">
                Your Workforce — fully in Motion.
                </p>
            </div>

            {/* GRAPH */}
            <div className="w-full">
                <div className="relative h-64 w-full px-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">

                    <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="100%" stopColor="#22d3ee"/>
                    </linearGradient>

                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#6366f1"/>
                    </linearGradient>
                    </defs>

                    {[40, 90, 140, 190, 240, 290, 340].map((x, i) => {
                    const heights = [70, 110, 140, 100, 160, 130, 90];
                    return (
                        <motion.rect
                        key={i}
                        x={x}
                        width="26"
                        rx="8"
                        fill="url(#barGradient)"
                        initial={{ height: 0, y: 200 }}
                        animate={{ height: heights[i], y: 200 - heights[i] }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                        style={{
                            filter: "drop-shadow(0px 8px 20px rgba(99,102,241,0.35))",
                        }}
                        />
                    );
                    })}

                    <motion.path
                    d="M 55 150 Q 105 120, 155 90 T 255 80 T 355 140"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                    />

                    <motion.circle
                    cx="255"
                    cy="80"
                    r="6"
                    fill="#6366f1"
                    animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        filter: "drop-shadow(0px 0px 14px rgba(99,102,241,0.9))",
                    }}
                    />
                </svg>
                </div>
            </div>

            </div>
        </div>
        </motion.div>

      {/* --- RIGHT SIDE: THE AUTH FORM --- */}
      <main className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 md:p-20 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-sky-900 text-center tracking-tight mb-2">
                Workforce Optimization, Reimagined.
            </h2>
            <p className="text-slate-500 text-center font-medium">Plan Smarter. Allocate Better. Maximize Utilization.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <SSOProvider type="google" />
            <SSOProvider type="microsoft" />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
              <span className="bg-white px-4">Direct Access</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <InputField 
              icon={Mail} 
              label="Workspace ID" 
              type="email" 
              placeholder="work@company.com" 
              value={email} 
              onChange={setEmail} />

            <InputField 
              icon={Lock} 
              label="Access Key"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={setPassword}
              endIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} 
                className="text-slate-400 hover:text-sky-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <button
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-slate-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Workspace</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        {/* Footer Rights */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500 font-medium">
            New to the platform? <button className="text-slate-900 font-bold hover:underline">Request Access</button>
          </p>
        </div>
        </motion.div>
      </main>
    </div>
  );
}

function InputField({ label, icon: Icon, endIcon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors">
          <Icon size={18} />
        </div>
        <input
          {...props}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all focus:bg-white focus:border-sky-500 focus:ring-[6px] focus:ring-sky-500/5 font-semibold text-slate-900"
        />
        {endIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2">{endIcon}</div>}
      </div>
    </div>
  );
}

function SSOProvider({ type }: { type: "google" | "microsoft" }) {
  const isGoogle = type === "google";
  return (
    <motion.button
      whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl bg-white font-bold text-slate-600 text-sm transition-all"
    >
      {isGoogle ? (
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 21 21">
          <path fill="#f25022" d="M0 0h10v10H0z"/><path fill="#7fba00" d="M11 0h10v10H11z"/><path fill="#00a4ef" d="M0 11h10v10H0z"/><path fill="#ffb900" d="M11 11h10v10H11z"/>
        </svg>
      )}
      {isGoogle ? "Google" : "Microsoft"}
    </motion.button>
  );
}