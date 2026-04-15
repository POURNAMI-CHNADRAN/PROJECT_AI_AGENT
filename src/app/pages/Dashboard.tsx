import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, TrendingUp, Clock, 
  ChevronRight, Sparkles, AlertCircle, FileText 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge"; // Assuming shadcn/ui or similar
import { useAnalytics } from "../../hooks/useAnalytics";

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const { loading, utilization = [], bench = [], revenue = [], suggestions = [] } = useAnalytics(month, year);

  if (loading) return <DashboardSkeleton />;

  // Aggregated Metrics
  const employeeCount = utilization.length;
  const totalRevenue = revenue.reduce((s: number, r: any) => s + (r.revenue || 0), 0);
  const avgUtilization = employeeCount > 0 
    ? Math.round(utilization.reduce((s: number, e: any) => s + (e.utilization || 0), 0) / employeeCount) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F4F7FA] p-8 space-y-8">
      
      {/* 1. TOP NAV / BREADCRUMB HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={14} />
            Intelligence Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Command <span className="text-slate-400 font-light">/ {today.toLocaleString('default', { month: 'long' })}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-200 shadow-sm">
            <FileText className="mr-2 h-4 w-4 text-slate-400" /> Export PDF
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all" onClick={() => navigate("/resources/portfolio")}>
            Manage Allocations
          </Button>
        </div>
      </header>

      {/* 2. KPI STRIP (Interactive) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="Avg Utilization" value={`${avgUtilization}%`} trend="+2.4%" icon={TrendingUp} variant={avgUtilization > 80 ? 'success' : 'warning'} />
        <KPICard label="Projected Revenue" value={`₹${(totalRevenue/100000).toFixed(1)}L`} trend="+12%" icon={DollarSign} variant="primary" />
        <KPICard label="Idle Capacity" value={`${bench.reduce((s, b) => s + b.benchHours, 0)}h`} trend="High Risk" icon={Clock} variant="danger" />
        <KPICard label="Active Talent" value={employeeCount} trend="Active" icon={Users} variant="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. MAIN RESOURCE LIST (Action-Oriented) */}
        <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-white px-8 pt-8 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Resource Allocation & Health</CardTitle>
              <Button variant="ghost" size="sm" className="text-sky-600 font-bold text-xs">VIEW ALL</Button>
            </div>
          </CardHeader>
          <CardContent className="bg-white px-8 pb-8">
            <div className="space-y-1">
              {utilization.slice(0, 6).map((emp: any) => (
                <div key={emp.employeeId} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                      {emp.name.split(' ').map((n:any) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">{emp.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block w-32">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>LOAD</span>
                        <span>{emp.utilization}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${emp.utilization}%` }} 
                          className={`h-full rounded-full ${emp.utilization > 100 ? 'bg-red-500' : 'bg-sky-500'}`} 
                        />
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4. AI & BENCH SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI SUGGESTIONS */}
          <Card className="rounded-3xl bg-slate-900 border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={80} />
            </div>
            <CardContent className="p-6 relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-sky-500 hover:bg-sky-500 text-white border-none px-2 py-0 text-[10px]">AI ENGINE</Badge>
                <h3 className="font-bold">Optimization Tips</h3>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {suggestions.map((s: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-white/10 rounded-xl border border-white/5 text-xs leading-relaxed">
                      {s.message}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Button className="w-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all py-6 rounded-xl shadow-xl">
                Apply Smart Rebalancing
              </Button>
            </CardContent>
          </Card>

          {/* BENCH RISK */}
          <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-tighter">
                <AlertCircle size={14} /> Critical Bench Risk
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
               {bench.slice(0,3).map((b: any) => (
                 <div key={b.employeeId} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
                    <span className="text-sm font-medium text-slate-700">{b.name}</span>
                    <Badge variant="outline" className="text-red-500 border-red-100 bg-red-50 text-[10px]">
                      {b.benchHours}h Idle
                    </Badge>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-component for KPI Cards
function KPICard({ label, value, trend, icon: Icon, variant }: any) {
  const styles: any = {
    primary: "text-sky-600 bg-sky-50",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50",
  };

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow cursor-default">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${styles[variant]}`}>
            <Icon size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">{trend}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <h2 className="text-2xl font-black text-slate-800">{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="h-screen bg-slate-50 p-8 flex flex-col gap-8 animate-pulse">
      <div className="h-12 w-1/3 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl" />)}
      </div>
      <div className="flex-1 bg-white rounded-3xl shadow-sm" />
    </div>
  );
}