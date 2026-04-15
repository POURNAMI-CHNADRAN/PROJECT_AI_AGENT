import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, ChevronRight } from "lucide-react";

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
      navigate(user.role === "Employee" ? "/my-profile" : "/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden relative bg-white">
      
      {/* --- GLOBAL ANIMATED GRADIENT BACKGROUND --- */}
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
        className="hidden lg:flex w-[55%] relative overflow-hidden border-r border-slate-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* PARALLAX ELEMENTS */}
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-200/20 blur-[120px] rounded-full"
          animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />

        {/* GRAIN OVERLAY */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative z-10 flex flex-col items-center justify-between px-20 py-12 w-full">
          {/* LOGO AREA */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-start"
          >
            <img src="/LOGO_COPY.png" className="h-12 drop-shadow-sm" alt="Logo" />
          </motion.div>

          {/* MAIN GRAPHIC & TEXT */}
          <div className="w-full max-w-lg space-y-12">
            <div className="space-y-4 text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Workforce optimization, <br />
                <span className="text-sky-600">reimagined.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-500 text-xl font-medium"
              >
                Plan smarter, allocate better, and maximize team utilization in one unified workspace.
              </motion.p>
            </div>

            {/* THE GRAPH pattern */}
            <motion.div
              className="relative h-64 w-full bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-2xl shadow-sky-200/20 p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Bar Pattern */}
                {[40, 90, 140, 190, 240, 290, 340].map((x, i) => {
                  const heights = [70, 110, 140, 100, 160, 130, 90];
                  return (
                    <motion.rect
                      key={i}
                      x={x}
                      width="24"
                      rx="6"
                      fill="#0ea5e9"
                      fillOpacity={0.15 + i * 0.1}
                      initial={{ height: 0, y: 200 }}
                      animate={{ height: heights[i], y: 200 - heights[i] }}
                      transition={{
                        delay: 0.8 + i * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                    />
                  );
                })}
                {/* Animated Path Line */}
                <motion.path
                  d="M 55 150 Q 105 120, 155 90 T 255 80 T 355 140"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                />
                {/* Pulse Point */}
                <motion.circle
                  cx="255"
                  cy="80"
                  r="6"
                  fill="#0ea5e9"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          </div>

          {/* FOOTER LEFT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="w-full flex items-center gap-6 text-slate-400 font-semibold text-xs tracking-widest uppercase"
          >
            <div className="flex items-center gap-2"><Shield size={14} /> Encrypted</div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div>ISO 27001 Certified</div>
          </motion.div>
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: THE AUTH FORM --- */}
      <main className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 md:p-20 relative bg-white/20 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px]"
        >
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium text-lg">Sign in to your enterprise account.</p>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <SSOProvider type="google" />
            <SSOProvider type="microsoft" />
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-[0.2em] text-slate-400">
              <span className="bg-white/80 px-4 backdrop-blur-sm">Or use email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <InputField 
                label="Corporate Email"
                icon={Mail} 
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={setEmail} 
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <button type="button" className="text-xs font-extrabold text-sky-600 hover:text-sky-700 transition">Forgot Password?</button>
                </div>
                <InputField 
                  icon={Lock} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={setPassword}
                  endIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-sky-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Rights */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
              New to the platform? <button className="text-slate-900 font-bold hover:underline">Request Access</button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/** * UI COMPONENTS (REFINED) */

function InputField({ label, icon: Icon, endIcon, ...props }: any) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors">
          <Icon size={20} />
        </div>
        <input
          {...props}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none transition-all duration-300 focus:border-sky-500 focus:ring-[6px] focus:ring-sky-500/5 placeholder:text-slate-300 text-slate-900 font-semibold"
        />
        {endIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
    </div>
  );
}

function SSOProvider({ type }: { type: "google" | "microsoft" }) {
  const isGoogle = type === "google";
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: "0 12px 20px -10px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-all font-bold text-slate-600 text-sm"
    >
      {isGoogle ? (
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 21 21">
          <path fill="#f25022" d="M0 0h10v10H0z"/><path fill="#7fba00" d="M11 0h10v10H11z"/><path fill="#00a4ef" d="M0 11h10v10H0z"/><path fill="#ffb900" d="M11 11h10v10H11z"/>
        </svg>
      )}
      <span>{isGoogle ? "Google" : "Microsoft"}</span>
    </motion.button>
  );
}