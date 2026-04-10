import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  User, Activity, TrendingDown, AlertCircle, Heart, Activity as LiverIcon, 
  Droplet, Brain, Clock, ChevronRight, UploadCloud, ArrowRight
} from 'lucide-react';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

const RiskBadge = ({ level }) => {
  const isHigh = level.toLowerCase().includes('high');
  const isModerate = level.toLowerCase().includes('moderate');
  const color = isHigh ? 'bg-red-100 text-red-700 border-red-200' : 
                isModerate ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                'bg-green-100 text-green-700 border-green-200';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${color}`}>
      {level}
    </span>
  );
};

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6 ${className}`}>
    {children}
  </div>
);

const DiseaseCard = ({ title, icon: Icon, assessed, score, risk, onStart, onView }) => (
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
        <button onClick={onView} className="mt-2 w-full py-2.5 rounded-xl bg-gray-100 text-purple-700 font-medium hover:bg-purple-100 transition-colors text-sm">
          View Details
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-3 h-full justify-between">
        <p className="text-sm font-medium text-gray-500 italic flex-1 flex items-center">Not Assessed Yet</p>
        <button onClick={onStart} className="mt-2 w-full py-2.5 rounded-xl border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-colors text-sm">
          Start Assessment
        </button>
      </div>
    )}
  </GlassCard>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const [summaryData, setSummaryData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [diseaseStates, setDiseaseStates] = useState({
    heart: { assessed: false },
    diabetes: { assessed: false },
    liver: { assessed: false },
    kidney: { assessed: false }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchDashboardData = async () => {
      try {
        setTimeout(() => {
          setSummaryData({
            latestScore: 85,
            lastUpdated: '10 Apr 2026',
            riskLevel: 'Low Risk',
            topFactor: 'Stable System',
            trend: [
              { date: 'Jan', score: 75 },
              { date: 'Feb', score: 78 },
              { date: 'Mar', score: 82 },
              { date: 'Apr', score: 85 }
            ]
          });

          setHistoryData([
            { id: 1, date: '10 Apr 2026', type: 'Quick Assessment', risk: 'Low Risk', score: 85, factor: 'Stable Vitals' },
            { id: 2, date: '01 Mar 2026', type: 'Quick Assessment', risk: 'Moderate Risk', score: 78, factor: 'Elevated BP' },
            { id: 3, date: '15 Jan 2026', type: 'Quick Assessment', risk: 'Moderate Risk', score: 75, factor: 'Dietary Spikes' }
          ]);

          setDiseaseStates({
            heart: { assessed: true, score: 72, risk: 'Moderate Risk' },
            diabetes: { assessed: false },
            liver: { assessed: true, score: 82, risk: 'High Risk' },
            kidney: { assessed: false }
          });
        }, 500);
      } catch (err) {
        console.error("Dashboard API parsing error: ", err);
      }
    };

    fetchDashboardData();
    setTimeout(() => setMounted(true), 100);
  }, [navigate]);

  if (!summaryData) return <div className="min-h-screen bg-[#f8f5fd] flex items-center justify-center font-sans tracking-wide text-purple-600 font-bold">Loading Dashboard...</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] font-sans pb-20">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Dashboard Page
      </div>

      <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-lg border-b border-white/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              PreventIQ
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold cursor-pointer">
              <User size={18} />
            </div>
          </div>
        </div>
      </nav>

      <div className={`pt-24 max-w-7xl mx-auto px-6 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Main Health Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Your Quick Assessment base overview.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/assess/general')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-[0_8px_16px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] hover:-translate-y-1 transition-all"
            >
              Take Quick Assessment <ChevronRight size={18} />
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
          
          <div className="col-span-1 bg-gradient-to-br from-white/90 to-purple-50/80 border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-6 flex items-center gap-2"><Activity size={16}/> Quick Assessment Score</h2>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600 tracking-tighter">{summaryData.latestScore}</span>
              <div className="pb-2">
                <span className="block text-sm font-bold text-gray-400">/ 100</span>
                <span className="block text-xs font-medium text-gray-500 mt-1">{summaryData.lastUpdated}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80 shadow-sm">
                 <span className="text-sm font-semibold text-gray-700">Risk Level</span>
                 <RiskBadge level={summaryData.riskLevel} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80 shadow-sm">
                 <span className="text-sm font-semibold text-gray-700">System State</span>
                 <span className="text-sm font-bold text-indigo-600 flex items-center gap-1"><AlertCircle size={14}/> {summaryData.topFactor}</span>
              </div>
            </div>
          </div>

          <GlassCard className="col-span-1 lg:col-span-2 flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-6 flex items-center gap-2">
              <TrendingDown size={16}/> Quick Assessment Trend Analysis
            </h2>
            <div className="flex-1 min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summaryData.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9d5ff" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(168,85,247,0.2)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#a855f7" 
                    strokeWidth={4}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#fff', stroke: '#a855f7', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-4 px-2 tracking-tight">Disease-Specific Diagnostics</h2>
        <div className="flex mb-4 px-2 text-sm text-gray-500 font-medium">Complete specialized diagnostic assessments individually to isolate independent organ performance limits natively.</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
           <DiseaseCard 
               title="Cardiovascular" 
               icon={Heart} 
               assessed={diseaseStates.heart.assessed} 
               score={diseaseStates.heart.score} 
               risk={diseaseStates.heart.risk} 
               onStart={() => navigate('/assess/heart')} 
               onView={() => navigate('/dashboard/heart')} 
           />
           <DiseaseCard 
               title="Metabolic (Diabetes)" 
               icon={Activity} 
               assessed={diseaseStates.diabetes.assessed} 
               score={diseaseStates.diabetes.score} 
               risk={diseaseStates.diabetes.risk} 
               onStart={() => navigate('/assess/diabetes')} 
               onView={() => navigate('/dashboard/diabetes')} 
           />
           <DiseaseCard 
               title="Hepatic (Liver)" 
               icon={LiverIcon} 
               assessed={diseaseStates.liver.assessed} 
               score={diseaseStates.liver.score} 
               risk={diseaseStates.liver.risk} 
               onStart={() => navigate('/assess/liver')} 
               onView={() => navigate('/dashboard/liver')} 
           />
           <DiseaseCard 
               title="Renal (Kidney)" 
               icon={Droplet} 
               assessed={diseaseStates.kidney.assessed} 
               score={diseaseStates.kidney.score} 
               risk={diseaseStates.kidney.risk} 
               onStart={() => navigate('/assess/kidney')} 
               onView={() => navigate('/dashboard/kidney')} 
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-white/20 transition-colors duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm shadow-sm rounded-2xl flex items-center justify-center mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Mental Wellbeing Check</h3>
              <p className="text-purple-100 font-medium mb-6 max-w-sm">
                Physical health is actively intertwined with cognitive limits. Track stress metrics intelligently today.
              </p>
              <button className="flex items-center gap-2 font-bold text-sm bg-white text-indigo-600 px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all">
                Launch Assessment <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <GlassCard className="flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2"><Clock className="text-purple-500" size={20}/> Biological Aging</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Connect wearable biometric limits dynamically mapping chronological thresholds tracking relative to DNA baseline standards.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-gray-800">28<span className="text-sm font-medium text-gray-400"> yrs</span></span>
                <span className="text-xs font-bold text-purple-500 uppercase tracking-wider mt-1">Bio Age</span>
              </div>
              <div className="w-px h-10 bg-purple-100" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-gray-800">32<span className="text-sm font-medium text-gray-400"> yrs</span></span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Real Age</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="overflow-hidden p-0 sm:p-0 flex flex-col">
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-purple-100 bg-white/40">
             <h3 className="font-bold text-gray-800 text-lg">Quick Assessment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50/50">
                <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="px-6 md:px-8 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Risk Level</th>
                  <th className="px-6 py-4 font-semibold">Key Factor</th>
                  <th className="px-6 md:px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100/50">
                {historyData.map((row) => (
                  <tr key={row.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-6 md:px-8 py-5 font-medium text-gray-800">{row.date}</td>
                    <td className="px-6 py-5 text-gray-600 font-medium">{row.type}</td>
                    <td className="px-6 py-5 font-bold text-gray-800">{row.score}</td>
                    <td className="px-6 py-5"><RiskBadge level={row.risk} /></td>
                    <td className="px-6 py-5 text-gray-600 font-medium truncate max-w-[150px]">{row.factor}</td>
                    <td className="px-6 md:px-8 py-5 text-right">
                      <button className="text-purple-600 font-bold hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity">View Results <ChevronRight size={14} className="inline"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
