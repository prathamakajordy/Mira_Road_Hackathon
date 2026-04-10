import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField, ToggleGroup, RadioGroup } from '../components/FormComponents';
import { Activity, Droplets, HeartPulse } from 'lucide-react'; // Some subtle icons

export default function QuickAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    weight: '',
    height: '',
    bmi: '0.0',
    sysbp: '',
    diabp: '',
    glucose: 'Moderate',
    smoking: 'No',
    alcohol: 'No'
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.weight && formData.height) {
      const hMeters = parseFloat(formData.height) / 100;
      const wKg = parseFloat(formData.weight);
      if (hMeters > 0 && wKg > 0) {
        setFormData(prev => ({ ...prev, bmi: (wKg / (hMeters * hMeters)).toFixed(1) }));
      }
    } else {
      setFormData(prev => ({ ...prev, bmi: '0.0' }));
    }
  }, [formData.weight, formData.height]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assessment Data:", formData);
    // Future integration API call here
    navigate('/assess/result');
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen p-4 py-12 bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Assessment Page
      </div>
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         {/* Floating softly glowing distinct shapes simulating cells/DNA abstractly */}
         <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
         <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
         
         <svg className="absolute opacity-5 w-full h-full stroke-purple-400" preserveAspectRatio="none" viewBox="0 0 100 100">
           <path d="M0,50 Q25,10 50,50 T100,50" fill="none" strokeWidth="0.5" strokeDasharray="2,2" className="animate-[pulse_10s_linear_infinite]" />
         </svg>
      </div>

      {/* Main Form Container */}
      <div className={`relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(200,180,230,0.3)] border border-white/80 rounded-3xl p-8 sm:p-10 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30 mb-4 scale-110">
             <HeartPulse size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quick Health Assessment</h1>
          <p className="text-sm text-gray-500 mt-1">Provide your baseline vitals to begin.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* SECTION 1: Base Vitals */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200/60 pb-1">Base Vitals</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" type="number" min="1" max="120" placeholder="e.g. 30" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} />
              <div className="col-span-2">
                 <ToggleGroup label="Gender" options={['Male', 'Female', 'Other']} selected={formData.gender} onChange={(val) => handleChange('gender', val)} />
              </div>
              <InputField label="Weight (kg)" type="number" min="1" placeholder="e.g. 70" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} />
              <InputField label="Height (cm)" type="number" min="50" placeholder="e.g. 175" value={formData.height} onChange={(e) => handleChange('height', e.target.value)} />
              <div className="col-span-2">
                 <InputField label="BMI (Auto-calculated)" type="text" value={formData.bmi} disabled={true} />
              </div>
            </div>
          </div>

          {/* SECTION 2: Health Metrics */}
          <div className="space-y-4 mt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200/60 pb-1 flex items-center gap-1"><Activity size={14}/> Health Metrics</h2>
            
            <div className="grid grid-cols-2 gap-4">
               <InputField label="Systolic (mmHg)" type="number" placeholder="120" value={formData.sysbp} onChange={(e) => handleChange('sysbp', e.target.value)} />
               <InputField label="Diastolic (mmHg)" type="number" placeholder="80" value={formData.diabp} onChange={(e) => handleChange('diabp', e.target.value)} />
            </div>
            
            <RadioGroup label="Glucose Level" options={['Low', 'Moderate', 'High']} selected={formData.glucose} onChange={(val) => handleChange('glucose', val)} />
          </div>

          {/* SECTION 3: Lifestyle */}
          <div className="space-y-4 mt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200/60 pb-1 flex items-center gap-1"><Droplets size={14}/> Lifestyle</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <ToggleGroup label="Smoking Status" options={['Yes', 'No']} selected={formData.smoking} onChange={(val) => handleChange('smoking', val)} />
              <ToggleGroup label="Alcohol Status" options={['Yes', 'No']} selected={formData.alcohol} onChange={(val) => handleChange('alcohol', val)} />
            </div>
          </div>

          <button type="submit" className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold text-lg shadow-[0_8px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_25px_rgba(124,58,237,0.45)] hover:-translate-y-1 transition-all duration-300">
            Start Assessment
          </button>
        </form>

      </div>
    </div>
  );
}
