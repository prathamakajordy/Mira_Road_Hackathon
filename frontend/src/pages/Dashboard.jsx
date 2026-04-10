import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  User, Activity, TrendingDown, AlertCircle, Heart, Activity as LiverIcon, 
  Droplet, Brain, Clock, ChevronRight, UploadCloud, ArrowRight
} from 'lucide-react';

// MOCK DATA
const mockTrendData = [
  { date: '10 Jan', score: 65 },
  { date: '21 Jan', score: 68 },
  { date: '04 Feb', score: 72 },
  { date: '15 Feb', score: 70 },
  { date: '01 Mar', score: 76 },
  { date: '12 Mar', score: 82 },
  { date: '28 Mar', score: 85 }
];

const mockHistoryData = [
  { id: 1, date: '28 Mar 2026', type: 'General Checkup', risk: 'Low', score: 85, factor: 'Stable Vitals' },
  { id: 2, date: '12 Mar 2026', type: 'Metabolic Panel', risk: 'Low', score: 82, factor: 'Glucose Optimization' },
  { id: 3, date: '01 Mar 2026', type: 'Cardio Focus', risk: 'Moderate', score: 76, factor: 'Elevated BP' },
  { id: 4, date: '15 Feb 2026', type: 'General Checkup', risk: 'Moderate', score: 70, factor: 'High BMI' },
];

// Reusable Components
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6 ${className}`}>
    {children}
  </div>
);

const RiskBadge = ({ level }) => {
  const colors = {
    'Low': 'bg-green-100 text-green-700 border-green-200',
    'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'High': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[level] || colors['Moderate']}`}>
      {level} Risk
    </span>
  );
};

const DiseaseCard = ({ title, icon: Icon, assessed, score, risk }) => (
  <GlassCard className="flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
    {assessed ? (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
           <div>
             <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Score</p>
             <p className="text-3xl font-bold text-gray-800">{score}</p>
           </div>
           <RiskBadge level={risk} />
        </div>
        <button className="mt-2 w-full py-2.5 rounded-xl bg-gray-100 text-purple-700 font-medium hover:bg-purple-100 transition-colors text-sm">
          View Details
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-3 h-full justify-between">
        <p className="text-sm font-medium text-gray-500 italic flex-1 flex items-center">Not Assessed Yet</p>
        <button className="mt-2 w-full py-2.5 rounded-xl border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-colors text-sm">
          Start Assessment
        </button>
      </div>
    )}
  </GlassCard>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] font-sans pb-20">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Dashboard Page
      </div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-lg border-b border-white/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Activity size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Neofuture</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-gray-600 hidden sm:block">Welcome, Alex</span>
             <button className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 hover:bg-purple-200 transition-colors">
               <User size={18} />
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`pt-24 max-w-7xl mx-auto px-6 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Health Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Hello Alex — here's your overview for {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/assess/general')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-[0_8px_16px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] hover:-translate-y-1 transition-all"
            >
              Take New Assessment <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/report')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-purple-700 font-semibold shadow-sm border border-purple-200 hover:bg-purple-50 hover:-translate-y-1 transition-all"
            >
              <UploadCloud size={18} /> Upload Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* LATEST RISK CARD (HERO) */}
          <GlassCard className="col-span-1 bg-gradient-to-br from-white/90 to-purple-50/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-6 flex items-center gap-2"><Activity size={16}/> Latest Status</h2>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600 tracking-tighter">85</span>
              <div className="pb-2">
                <span className="block text-sm font-bold text-gray-400">/ 100</span>
                <span className="block text-xs font-medium text-gray-500 mt-1">Mar 28, 2026</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80">
                 <span className="text-sm font-semibold text-gray-700">Risk Level</span>
                 <RiskBadge level="Low" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80">
                 <span className="text-sm font-semibold text-gray-700">Primary Factor</span>
                 <span className="text-sm font-bold text-indigo-600 flex items-center gap-1"><AlertCircle size={14}/> Stable Vitals</span>
              </div>
            </div>
          </GlassCard>

          {/* RISK TREND GRAPH */}
          <GlassCard className="col-span-1 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                <TrendingDown size={16}/> Risk Trend (Last 90 Days)
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                Risk decreased by 20 points ↓
              </span>
            </div>
            
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9d5ff" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(168,85,247,0.2)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#7c3aed', fontWeight: 'bold' }}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={4}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#c084fc', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* QUICK STATS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <GlassCard className="flex items-center gap-4 py-5 hover:bg-white/80 transition-colors">
             <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full"><Clock size={20}/></div>
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Checks</p>
               <p className="text-2xl font-extrabold text-gray-800">4</p>
             </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 py-5 hover:bg-white/80 transition-colors">
             <div className="p-3 bg-green-100 text-green-600 rounded-full"><TrendingDown size={20}/></div>
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Since Last</p>
               <p className="text-2xl font-extrabold text-green-600">+3 Points</p>
             </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 py-5 hover:bg-white/80 transition-colors">
             <div className="p-3 bg-pink-100 text-pink-600 rounded-full"><AlertCircle size={20}/></div>
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top Factor</p>
               <p className="text-lg font-bold text-gray-800">Blood Pressure</p>
             </div>
          </GlassCard>
        </div>

        {/* DISEASE ORGAN CARDS */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2 tracking-tight">Organ Specific Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <DiseaseCard title="Cardiovascular" icon={Heart} assessed={true} score={88} risk="Low" />
           <DiseaseCard title="Metabolic (Diabetes)" icon={Activity} assessed={true} score={75} risk="Moderate" />
           <DiseaseCard title="Hepatic (Liver)" icon={LiverIcon} assessed={false} />
           <DiseaseCard title="Renal (Kidney)" icon={Droplet} assessed={false} />
        </div>

        {/* MENTAL HEALTH & HISTORY ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Brain size={24} /></div>
                <h3 className="font-bold text-gray-800 text-lg">Mental Wellbeing</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Psychological stress significantly impacts physical biomarkers. Take our deep-dive analysis to track cognitive load.
              </p>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center mb-6">
                 <p className="text-sm font-semibold text-gray-400 italic">Not Assessed Yet</p>
              </div>
            </div>
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:shadow-lg transition-all hover:-translate-y-0.5">
              Check Wellbeing <ArrowRight size={16} className="inline ml-1" />
            </button>
          </GlassCard>

          <GlassCard className="col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-gray-800 text-lg">Assessment History</h3>
               <button className="text-purple-600 text-sm font-semibold hover:text-purple-800 transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-purple-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {mockHistoryData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100/50 hover:bg-white/40 transition-colors group">
                      <td className="py-4 font-medium text-gray-800">{row.date}</td>
                      <td className="py-4 text-gray-600">{row.type}</td>
                      <td className="py-4 font-bold text-gray-800">{row.score}</td>
                      <td className="py-4"><RiskBadge level={row.risk} /></td>
                      <td className="py-4 text-right">
                        <button className="text-purple-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View <ChevronRight size={14} className="inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
}
