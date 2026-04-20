import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, TrendingUp, Clock, Sparkles, 
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  Filter, LayoutDashboard, Briefcase, Zap
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, 
  LineChart, Line 
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAnalytics } from "../../hooks/useAnalytics";

const COLORS = ['#0EA5E9', '#F43F5E', '#10B981', '#F59E0B', '#6366F1'];

export default function PremiumDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear] = useState(new Date().getFullYear());
  
  const { loading, utilization = [], bench = [], revenue = [], suggestions = [] } = 
    useAnalytics(selectedMonth, selectedYear);

  // --- Calculations ---
  const stats = useMemo(() => {
    const total = utilization.length;
    const billable = utilization.filter((e: any) => e.utilization > 0).length;
    const rev = revenue.reduce((s: number, r: any) => s + (r.revenue || 0), 0);
    const util = total > 0 ? Math.round(utilization.reduce((s, e) => s + e.utilization, 0) / total) : 0;
    
    return { total, billable, nonBillable: total - billable, revenue: rev, util };
  }, [utilization, revenue]);

  if (loading) return <PremiumSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6 lg:p-10 font-sans">
      
      {/* --- PREMIUM TOP NAVIGATION --- */}
      <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-8 bg-sky-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Executive Insight</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Workforce <span className="text-sky-600">OS</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <Calendar className="ml-2 text-slate-400" size={18} />
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-[140px] border-none font-bold text-slate-700 focus:ring-0">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                .map((m, i) => <SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="h-8 w-[1px] bg-slate-100 mx-1" />
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50"><Download size={18}/></Button>
        </div>
      </nav>

      {/* --- 1. KEY METRICS: THE POWER STRIP --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <MetricCard label="Total Headcount" value={stats.total} trend="+4" icon={<Users />} color="blue" />
        <MetricCard label="Billable Talent" value={stats.billable} trend="82%" icon={<Zap />} color="emerald" />
        <MetricCard label="Strategic Bench" value={stats.nonBillable} trend="-2" icon={<Clock />} color="rose" />
        <MetricCard label="Utilization Rate" value={`${stats.util}%`} trend="+2.4%" icon={<TrendingUp />} color="violet" />
        <MetricCard label="Revenue Forecast" value={`₹${(stats.revenue/100000).toFixed(1)}L`} trend="+12%" icon={<DollarSign />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- 2. THE VISUALIZATION ENGINE --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Billable vs Non-Billable */}
            <ChartWrapper title="Revenue Composition" subtitle="Billable vs Support Roles">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{name: 'Billable', value: stats.billable}, {name: 'Non-Billable', value: stats.nonBillable}]} 
                         innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                      <Cell fill="#0EA5E9" />
                      <Cell fill="#E2E8F0" />
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>

            {/* Project Allocation */}
            <ChartWrapper title="Project Allocation" subtitle="Resource density per account">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue.slice(0, 5)} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="projectName" type="category" axisLine={false} tickLine={false} fontSize={11} width={100} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} />
                    <Bar dataKey="revenue" fill="#6366F1" radius={[0, 10, 10, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Revenue by Project Line Chart */}
          <ChartWrapper title="Performance Forecast" subtitle="Projected revenue growth by portfolio">
            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="projectName" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94A3B8'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94A3B8'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartWrapper>
        </div>

        {/* --- 3. SIDEBAR: BENCH & AI --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Optimizer Card */}
          <Card className="bg-slate-900 border-none rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20 text-sky-400 animate-pulse">
              <Sparkles size={100} />
            </div>
            <CardContent className="p-8 relative z-10">
              <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 mb-4 px-3 py-1">AI STRATEGIST</Badge>
              <h3 className="text-xl font-bold text-white mb-6">Efficiency Levers</h3>
              <div className="space-y-4 mb-8">
                {suggestions.map((s: any, i: number) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-300 border-l-2 border-sky-500/50 pl-4 py-1">
                    {s.message}
                  </div>
                ))}
              </div>
              <Button className="w-full bg-white text-slate-900 font-black hover:bg-sky-50 py-7 rounded-2xl">
                RUN OPTIMIZATION
              </Button>
            </CardContent>
          </Card>

          {/* Bench Forecast Section */}
          <Card className="border-none shadow-xl shadow-slate-200/60 rounded-[2rem] bg-white">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black">Bench Risk</CardTitle>
                <Badge variant="outline" className="border-rose-100 text-rose-500 bg-rose-50 font-bold">CRITICAL</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              <div className="space-y-6">
                {bench.slice(0, 4).map((b: any) => (
                  <div key={b.employeeId} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                        {b.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{b.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-rose-500">{b.benchHours}h</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Availability</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// --- PREMIUM SUB-COMPONENTS ---

function MetricCard({ label, value, trend, icon, color }: any) {
  const colorMap: any = {
    blue: "text-sky-600 bg-sky-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    violet: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50"
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} className="mr-1" /> {trend}
        </div>
      </div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-3xl font-black text-slate-900">{value}</h2>
    </motion.div>
  );
}

function ChartWrapper({ title, subtitle, children }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="text-xl font-black text-slate-900">{title}</CardTitle>
        <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
      </CardHeader>
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
}

function PremiumSkeleton() {
  return (
    <div className="p-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="h-10 w-48 bg-slate-200 rounded-full mb-10" />
      <div className="grid grid-cols-5 gap-6 mb-10">
        {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-slate-200 rounded-[2rem]" />)}
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 h-96 bg-white rounded-[2.5rem]" />
        <div className="col-span-4 h-96 bg-slate-900 rounded-[2.5rem]" />
      </div>
    </div>
  );
}