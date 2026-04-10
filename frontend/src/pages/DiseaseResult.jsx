import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, ArrowRight, CheckCircle2, Activity, Coffee, Brain, Stethoscope 
} from 'lucide-react';

const mockData = {
  heart: {
    score: 78,
    riskLevel: 'High Risk',
    shapFactors: [
      { name: "Smoking", value: 0.35, pct: 35 },
      { name: "High Blood Pressure", value: 0.25, pct: 25 },
      { name: "Low Exercise", value: 0.15, pct: 15 }
    ],
    explanation: {
      normal: "Your current lifestyle and medical biomarkers suggest an elevated risk framework for cardiovascular disease. The cumulative impact of vascular tension coupled with endothelial dysfunction markers point towards immediate prophylactic requirements.",
      simple: "You have a high chance of developing heart problems. This is mainly because of smoking and high blood pressure adding stress to your blood vessels."
    },
    plan: {
      diet: ["Reduce sodium (salt) intake", "Avoid trans fats and processed foods", "Incorporate omega-3 rich fish"],
      lifestyle: ["Exercise 30 mins daily (moderate cardio)", "Begin smoking cessation program", "Sleep 7-8 hours per night"],
      doctor: ["Consult a cardiologist immediately", "Schedule an ECG scan", "Get a full lipid panel blood test"]
    }
  },
  diabetes: {
    score: 65,
    riskLevel: 'Moderate Risk',
    shapFactors: [
      { name: "High BMI", value: 0.40, pct: 40 },
      { name: "Family History", value: 0.20, pct: 20 },
      { name: "Sugary Diet", value: 0.15, pct: 15 }
    ],
    explanation: {
      normal: "Your metabolic indicators present a moderate probability of insulin resistance progression. Persistent glycemic spikes caused by dietary habits may overload pancreatic beta cells, accelerating the onset of Type 2 Diabetes.",
      simple: "Your weight and diet are putting you at risk for diabetes. Your body is struggling to manage blood sugar efficiently."
    },
    plan: {
      diet: ["Cut out sugary drinks and sodas", "Increase fiber from vegetables", "Switch to complex carbohydrates"],
      lifestyle: ["Aim for 10,000 steps daily", "Try intermittent fasting", "Monitor weight weekly"],
      doctor: ["Check fasting blood glucose levels", "Take an HbA1C test", "Consult a dietitian"]
    }
  },
  kidney: {
    score: 30,
    riskLevel: 'Low Risk',
    shapFactors: [
      { name: "Dehydration", value: 0.15, pct: 15 },
      { name: "High Protein Intake", value: 0.05, pct: 5 }
    ],
    explanation: {
      normal: "Your renal biomarkers are primarily within physiological safety bounds. The Glomerular Filtration Rate appears stable, indicating efficient blood filtration.",
      simple: "Your kidneys look healthy! Keep drinking water and maintaining a balanced diet to prevent future issues."
    },
    plan: {
      diet: ["Drink 8-10 glasses of water daily", "Limit excess salt intake"],
      lifestyle: ["Maintain healthy blood pressure", "Avoid overusing painkillers (NSAIDs)"],
      doctor: ["Routine yearly physical checkup", "No immediate specialist needed"]
    }
  },
  liver: {
    score: 82,
    riskLevel: 'High Risk',
    shapFactors: [
      { name: "High Alcohol Intake", value: 0.50, pct: 50 },
      { name: "Abdominal Pain", value: 0.20, pct: 20 },
      { name: "Fatigue", value: 0.10, pct: 10 }
    ],
    explanation: {
      normal: "Hepatic enzymes and patient-reported symptoms indicate a high probability of structural damage to the liver tissue, potentially causing fibrosis or fatty liver formation.",
      simple: "Your frequent alcohol use is severely stressing your liver. You need to stop drinking immediately to prevent permanent damage."
    },
    plan: {
      diet: ["Strictly avoid alcohol completely", "Eat antioxidant-rich fruits like berries", "Avoid greasy or fried food"],
      lifestyle: ["Rest when feeling fatigued", "Avoid exposure to toxins/chemicals"],
      doctor: ["See a hepatologist immediately", "Schedule an ultrasound of the abdomen", "Take a comprehensive liver panel (ALT/AST) test"]
    }
  }
};

const RiskGauge = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
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

  // For risk, high = red, low = green
  const getGradient = () => {
    if (score < 40) return { start: '#34d399', end: '#10b981' }; // Green
    if (score < 75) return { start: '#fb923c', end: '#fb7185' }; // Orange/Peach
    return { start: '#ef4444', end: '#f43f5e' }; // Red
  };
  
  const colors = getGradient();
  const radius = 60;
  const circumference = 2 * Math.PI * radius; 
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-48 h-48 mb-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke="#f3e8ff"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-gray-800">{currentScore}%</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Risk Score</span>
      </div>
    </div>
  );
};

const FactorBar = ({ name, pct, delay }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(pct), delay);
  }, [pct, delay]);

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
        <span>{name}</span>
        <span className="text-purple-600">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const PlanList = ({ items, icon: Icon, colorClass }) => (
  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/40 border border-white/80">
    {items.map((item, idx) => (
      <div key={idx} className="flex flex-start gap-3">
        <Icon size={20} className={`${colorClass} shrink-0 mt-0.5`} />
        <span className="text-sm font-medium text-gray-700 leading-snug">{item}</span>
      </div>
    ))}
  </div>
);

export default function DiseaseResult() {
  const { disease } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);

  const data = mockData[disease] || mockData['heart'];

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const badgeColor = data.score >= 75 ? 'bg-red-100 text-red-700 border-red-200' :
                     data.score >= 40 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                     'bg-green-100 text-green-700 border-green-200';

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen p-4 py-12 bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Disease Result Page
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
         <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className={`relative z-10 w-full max-w-3xl flex flex-col items-center transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        {/* HEADER & TOGGLE */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 uppercase tracking-tight">
            {disease} Risk Match
          </h1>
          <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-full border border-white/80 shadow-sm">
            <span className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${!simpleMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`} onClick={() => setSimpleMode(false)}>Medical View</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${simpleMode ? 'bg-purple-600 text-white' : 'text-gray-500'}`} onClick={() => setSimpleMode(true)}>Simple View</span>
          </div>
        </div>

        {/* ALERT LOGIC */}
        {data.score >= 75 && (
          <div className="w-full mb-8 animate-[pulse_2s_ease-in-out_infinite]">
            <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 rounded-2xl shadow-sm">
              <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-red-800 uppercase tracking-wide text-sm">Critical Alert</h3>
                <p className="text-red-600/90 text-sm font-medium mt-0.5">High Risk Detected — Please consider consulting a doctor immediately.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          
          {/* GAUGE BLOCK */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(200,180,230,0.3)]">
            <RiskGauge score={data.score} />
            <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest border shadow-sm ${badgeColor}`}>
              {data.riskLevel}
            </span>
          </div>

          {/* SHAP FACTORS */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-[0_8px_32px_rgba(200,180,230,0.3)]">
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-6 flex items-center gap-2">
              <Activity size={16} /> Why You're At Risk
            </h2>
            <div className="flex flex-col">
              {data.shapFactors.map((factor, idx) => (
                <FactorBar key={idx} name={factor.name} pct={factor.pct} delay={300 + (idx * 200)} />
              ))}
            </div>
          </div>

        </div>

        {/* EXPLANATION */}
        <div className="w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-[0_8px_32px_rgba(200,180,230,0.2)]">
          <p className="text-gray-700 leading-relaxed font-medium text-[15px]">
            {simpleMode ? data.explanation.simple : data.explanation.normal}
          </p>
        </div>

        {/* PERSONALISED PLAN */}
        <div className="w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 mb-10 shadow-[0_8px_32px_rgba(200,180,230,0.2)]">
          <h2 className="text-lg font-extrabold text-gray-800 mb-6 border-b border-purple-100 pb-3 tracking-tight">Your Personalised Remediation Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Coffee size={16} /> Diet
              </h3>
              <PlanList items={data.plan.diet} icon={CheckCircle2} colorClass="text-green-500" />
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={16} /> Lifestyle
              </h3>
              <PlanList items={data.plan.lifestyle} icon={CheckCircle2} colorClass="text-purple-500" />
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Stethoscope size={16} /> Doctor
              </h3>
              <PlanList items={data.plan.doctor} icon={CheckCircle2} colorClass="text-pink-500" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.5)] hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 text-lg">
            View in Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

      </div>
    </div>
  );
}
