import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

const HealthGauge = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // ms
    const increment = score / (duration / 16); 
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        clearInterval(timer);
        setCurrentScore(score);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score]);

  // Map score to color
  const getGradient = () => {
    if (score < 50) return { start: '#ef4444', end: '#f43f5e' }; // red/pink
    if (score < 80) return { start: '#fb923c', end: '#fb7185' }; // peach/orange
    return { start: '#a855f7', end: '#34d399' }; // lavender/green
  };
  
  const colors = getGradient();
  const radius = 90;
  const circumference = Math.PI * radius; // semi-circle
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-36 overflow-hidden mb-6">
      <svg className="w-full h-full transform" viewBox="0 0 200 100">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background Arc */}
        <path
          d="M 10 95 A 90 90 0 0 1 190 95"
          fill="none"
          stroke="#f3e8ff"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Animated Arc */}
        <path
          d="M 10 95 A 90 90 0 0 1 190 95"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-5xl font-bold text-gray-800 tracking-tight">{currentScore}%</span>
        <span className="text-sm font-semibold uppercase tracking-wider text-gray-400 mt-1">Health Score</span>
      </div>
    </div>
  );
};

const InsightCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 border border-white/60 shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300">
    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 shrink-0">
      <Icon size={24} />
    </div>
    <div className="flex flex-col">
      <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase">{title}</h3>
      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function AssessmentResult() {
  const [mounted, setMounted] = useState(false);
  
  // Mock Data
  const report = {
    healthScore: 78,
    reasons: {
      bmi: "Your BMI is slightly above optimal range. A balanced diet and regular cardio could help improve this metric.",
      bloodPressure: "Blood pressure indicates mild elevation. Consider reducing sodium intake and managing stress levels.",
      glucose: "Glucose levels are within the normal bounds, which is excellent for long-term health."
    }
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen p-4 py-16 bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] overflow-x-hidden font-sans">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
         <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className={`relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* HERO GAUGE SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-sm font-semibold mb-6 shadow-sm border border-purple-200">
             <ShieldCheck size={16} /> Assessment Complete
          </div>
          <HealthGauge score={report.healthScore} />
          <p className="text-gray-500 text-center max-w-md mx-auto leading-relaxed text-sm">
            Based on your baseline vitals, your health score is fairly strong. Review the insights below for targeted focus areas.
          </p>
        </div>

        {/* INSIGHTS CONTAINER */}
        <div className="w-full bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(200,180,230,0.3)] border border-white/80 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-purple-100 pb-3">Health Insights</h2>
          
          <InsightCard 
            icon={Activity} 
            title="BMI Analysis" 
            description={report.reasons.bmi} 
          />
          <InsightCard 
            icon={Heart} 
            title="Cardiovascular" 
            description={report.reasons.bloodPressure} 
          />
          <InsightCard 
            icon={Droplet} 
            title="Metabolic" 
            description={report.reasons.glucose} 
          />
          
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-purple-600/80 font-medium text-sm mb-4">
            Save your results and track progress over time
          </p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_15px_30px_rgba(236,72,153,0.5)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Create a Free Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
