import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Activity, TrendingDown, Coffee, Heart, CheckCircle2, ChevronRight, UploadCloud, AlertCircle
} from 'lucide-react';

const mockDashboardData = {
  heart: {
    disease: "Heart",
    latestScore: 72,
    riskLevel: "Moderate Risk",
    lastUpdated: "Apr 10, 2026",
    trend: [
      { date: "01 Mar", score: 85 },
      { date: "10 Mar", score: 80 },
      { date: "20 Mar", score: 78 },
      { date: "30 Mar", score: 75 },
      { date: "10 Apr", score: 72 }
    ],
    commonFactors: ["Smoking", "High BP", "Low Activity"],
    plan: {
      diet: ["Reduce salt intake", "Eat more fiber", "Avoid processed foods"],
      lifestyle: ["Walk 30 mins daily", "Quit smoking", "Manage stress"],
      doctor: ["Consult cardiologist", "Schedule ECG", "Check blood pressure"]
    },
    history: [
      { id: 1, date: "10 Apr 2026", score: 72, risk: "Moderate Risk", topFactor: "Smoking" },
      { id: 2, date: "30 Mar 2026", score: 75, risk: "Moderate Risk", topFactor: "High BP" },
      { id: 3, date: "01 Mar 2026", score: 85, risk: "High Risk", topFactor: "Low Activity" }
    ]
  },
  diabetes: {
    disease: "Diabetes",
    latestScore: 65,
    riskLevel: "Moderate Risk",
    lastUpdated: "Apr 10, 2026",
    trend: [
      { date: "01 Feb", score: 88 },
      { date: "15 Feb", score: 80 },
      { date: "01 Mar", score: 74 },
      { date: "15 Mar", score: 68 },
      { date: "10 Apr", score: 65 }
    ],
    commonFactors: ["High BMI", "Family History", "Sugary Diet"],
    plan: {
      diet: ["Cut out sugary drinks", "Increase vegetables", "Switch to complex carbs"],
      lifestyle: ["Aim for 10,000 steps daily", "Try intermittent fasting", "Monitor weight"],
      doctor: ["Check fasting blood glucose", "Take an HbA1C test", "Consult dietitian"]
    },
    history: [
      { id: 1, date: "10 Apr 2026", score: 65, risk: "Moderate Risk", topFactor: "Sugary Diet" },
      { id: 2, date: "15 Mar 2026", score: 68, risk: "Moderate Risk", topFactor: "High BMI" }
    ]
  },
  kidney: {
    disease: "Kidney",
    latestScore: 30,
    riskLevel: "Low Risk",
    lastUpdated: "Apr 10, 2026",
    trend: [
      { date: "Jan", score: 35 },
      { date: "Feb", score: 32 },
      { date: "Mar", score: 31 },
      { date: "Apr", score: 30 }
    ],
    commonFactors: ["Dehydration", "High Protein"],
    plan: {
      diet: ["Drink 8-10 glasses of water", "Limit salt intake", "Moderate protein"],
      lifestyle: ["Maintain healthy BP", "Avoid overusing NSAIDs", "Stay active"],
      doctor: ["Routine yearly checkup", "Monitor urine protein"]
    },
    history: [
      { id: 1, date: "10 Apr 2026", score: 30, risk: "Low Risk", topFactor: "Dehydration" }
    ]
  },
  liver: {
    disease: "Liver",
    latestScore: 82,
    riskLevel: "High Risk",
    lastUpdated: "Apr 10, 2026",
    trend: [
      { date: "Jan", score: 60 },
      { date: "Feb", score: 65 },
      { date: "Mar", score: 75 },
      { date: "Apr", score: 82 }
    ],
    commonFactors: ["High Alcohol", "Fatigue", "Abdominal Pain"],
    plan: {
      diet: ["Strictly avoid alcohol", "Eat antioxidant fruits", "Avoid greasy food"],
      lifestyle: ["Rest when feeling fatigued", "Avoid chemical exposure", "Maintain weight"],
      doctor: ["See a hepatologist", "Schedule ultrasound", "Take ALT/AST test"]
    },
    history: [
      { id: 1, date: "10 Apr 2026", score: 82, risk: "High Risk", topFactor: "High Alcohol" },
      { id: 2, date: "Mar 2026", score: 75, risk: "High Risk", topFactor: "Fatigue" }
    ]
  }
};

const PlanList = ({ items, icon: Icon, colorClass }) => (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/40 border border-white/80 h-full">
    {items.map((item, idx) => (
      <div key={idx} className="flex flex-start gap-3">
        <Icon size={20} className={`${colorClass} shrink-0 mt-0.5`} />
        <span className="text-sm font-medium text-gray-700 leading-snug">{item}</span>
      </div>
    ))}
  </div>
);

const RiskBadge = ({ level }) => {
  const isHigh = level.includes('High');
  const isLow = level.includes('Low');
  const color = isHigh ? 'bg-red-100 text-red-700 border-red-200' : 
                isLow ? 'bg-green-100 text-green-700 border-green-200' : 
                'bg-orange-100 text-orange-700 border-orange-200';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${color}`}>
      {level}
    </span>
  );
};

export default function DiseaseDashboard() {
  const { disease } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const data = mockDashboardData[disease] || mockDashboardData['heart'];

  useEffect(() => {
    // Auth Check Simulation
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to Auth (mocking for safety)');
      // navigate('/auth');
    }
    setTimeout(() => setMounted(true), 100);
  }, []);

  const calculatePointsChange = () => {
    if (data.trend.length < 2) return 0;
    const firstScore = data.trend[0].score;
    const lastScore = data.trend[data.trend.length - 1].score;
    return Math.abs(firstScore - lastScore);
  };
  const pointsChange = calculatePointsChange();
  const isImproving = data.trend.length >= 2 && data.trend[data.trend.length - 1].score < data.trend[data.trend.length - 2].score;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] font-sans pb-20">
      
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Disease Sub-Dashboard Page
      </div>

      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-lg border-b border-white/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-80 transition-opacity">
              Neofuture
            </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
            Back to Overview
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`pt-24 max-w-7xl mx-auto px-6 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{data.disease} Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Track your progress and manage your risk systematically.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/assess/${disease}`)}
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

        {/* TOP ROW: GRAPH AND LATEST CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* RISK TREND GRAPH (HERO) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2">
                <TrendingDown size={16}/> Risk Trend Analysis
              </h2>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${isImproving ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                Risk {isImproving ? 'decreased' : 'increased'} by {pointsChange} points {isImproving ? '↓' : '↑'}
              </span>
            </div>
            
            <div className="flex-1 min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9d5ff" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(168,85,247,0.2)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: isImproving ? '#10b981' : '#f43f5e', fontWeight: 'bold' }}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={isImproving ? '#34d399' : '#f43f5e'} 
                    strokeWidth={4}
                    dot={{ fill: isImproving ? '#34d399' : '#f43f5e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: isImproving ? '#10b981' : '#e11d48', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LATEST RESULT CARD */}
          <div className="col-span-1 bg-gradient-to-br from-white/90 to-purple-50/80 border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-6 flex items-center gap-2"><Activity size={16}/> Latest Status</h2>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600 tracking-tighter">{data.latestScore}</span>
              <div className="pb-2">
                <span className="block text-sm font-bold text-gray-400">/ 100</span>
                <span className="block text-xs font-medium text-gray-500 mt-1">{data.lastUpdated}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80 shadow-sm">
                 <span className="text-sm font-semibold text-gray-700">Risk Level</span>
                 <RiskBadge level={data.riskLevel} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/80 shadow-sm">
                 <span className="text-sm font-semibold text-gray-700">Top Factor</span>
                 <span className="text-sm font-bold text-indigo-600 flex items-center gap-1"><AlertCircle size={14}/> {data.trend.length > 0 && data.history[0]?.topFactor}</span>
              </div>
            </div>
          </div>

        </div>

        {/* WHY THIS DISEASE TAGS */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(200,180,230,0.2)] rounded-3xl p-6 mb-8">
           <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
             <Heart size={16}/> Underlying Factors
           </h2>
           <div className="flex flex-wrap gap-3">
             {data.commonFactors.map((factor, idx) => (
               <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 shadow-sm">
                 {factor}
               </span>
             ))}
           </div>
        </div>

        {/* ACTIVE PERSONALISED PLAN */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_8px_32px_rgba(200,180,230,0.2)]">
          <h2 className="text-lg font-extrabold text-gray-800 mb-6 border-b border-purple-100 pb-3 tracking-tight">Active Personalised Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Coffee size={16} /> Diet Modifications
              </h3>
              <PlanList items={data.plan.diet} icon={CheckCircle2} colorClass="text-green-500" />
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={16} /> Lifestyle Shifts
              </h3>
              <PlanList items={data.plan.lifestyle} icon={CheckCircle2} colorClass="text-purple-500" />
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={16} /> Medical Guidance
              </h3>
              <PlanList items={data.plan.doctor} icon={CheckCircle2} colorClass="text-pink-500" />
            </div>
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(200,180,230,0.2)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-800 text-lg">Assessment History</h3>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-purple-100 text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Risk Level</th>
                  <th className="pb-3 font-semibold">Top Factor</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.history.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100/50 hover:bg-white/40 transition-colors group">
                    <td className="py-4 font-medium text-gray-800">{row.date}</td>
                    <td className="py-4 font-bold text-gray-800">{row.score}</td>
                    <td className="py-4"><RiskBadge level={row.risk} /></td>
                    <td className="py-4 text-gray-600 font-medium">{row.topFactor}</td>
                    <td className="py-4 text-right">
                      <button className="text-purple-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View <ChevronRight size={14} className="inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
