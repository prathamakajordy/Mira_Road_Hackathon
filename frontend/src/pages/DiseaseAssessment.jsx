import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { InputField, ToggleGroup, RadioGroup } from '../components/FormComponents';

const diseaseConfig = {
  heart: {
    title: 'Heart Disease',
    fields: [
      { name: 'chest_pain', label: 'Experiencing Chest Pain?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'blood_pressure', label: 'Blood Pressure', type: 'number', placeholder: 'e.g. 120 (optional)' },
      { name: 'cholesterol', label: 'Cholesterol Level', type: 'number', placeholder: 'e.g. 200 (optional)' },
      { name: 'smoking', label: 'Do you smoke?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'diabetes_history', label: 'History of Diabetes?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'exercise_level', label: 'Exercise Level', type: 'segmented', options: ['Low', 'Medium', 'High'] }
    ]
  },
  diabetes: {
    title: 'Diabetes',
    fields: [
      { name: 'bmi', label: 'BMI or Body Weight (kg)', type: 'number', placeholder: 'e.g. 24.5' },
      { name: 'family_history', label: 'Family History of Diabetes?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'physical_activity', label: 'Physical Activity', type: 'segmented', options: ['Low', 'Medium', 'High'] },
      { name: 'frequent_urination', label: 'Frequent Urination?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'increased_thirst', label: 'Increased Thirst?', type: 'toggle', options: ['Yes', 'No'] }
    ]
  },
  kidney: {
    title: 'Kidney Disease',
    fields: [
      { name: 'swelling', label: 'Unexplained Swelling?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'fatigue', label: 'Frequent Fatigue?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'appetite', label: 'Current Appetite', type: 'toggle', options: ['Good', 'Poor'] },
      { name: 'blood_pressure', label: 'Blood Pressure Pattern', type: 'number', placeholder: 'e.g. 120 (optional)' },
      { name: 'diabetes_history', label: 'History of Diabetes?', type: 'toggle', options: ['Yes', 'No'] }
    ]
  },
  liver: {
    title: 'Liver Disease',
    fields: [
      { name: 'alcohol_consumption', label: 'Frequent Alcohol Consumption?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'fatigue', label: 'Frequent Fatigue?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'abdominal_pain', label: 'Abdominal Pain?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'appetite', label: 'Current Appetite', type: 'toggle', options: ['Good', 'Poor'] },
      { name: 'nausea', label: 'Experiencing Nausea?', type: 'toggle', options: ['Yes', 'No'] },
      { name: 'yellowing_eyes', label: 'Yellowing of Eyes?', type: 'toggle', options: ['Yes', 'No'] }
    ]
  }
};

export default function DiseaseAssessment() {
  const { disease } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male'
  });

  useEffect(() => {
    // Auth Check Simulation
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to Auth (mocking for safety)');
      // navigate('/auth');
    }

    if (!diseaseConfig[disease]) {
      // Invalid disease redirect
      navigate('/dashboard');
      return;
    }

    // Initialize dynamic fields
    const initialData = { age: '', gender: 'Male' };
    diseaseConfig[disease].fields.forEach(f => {
      initialData[f.name] = f.type === 'number' ? '' : f.options[0];
    });
    setFormData(initialData);

    setTimeout(() => setMounted(true), 100);
  }, [disease, navigate]);

  const config = diseaseConfig[disease];
  
  if (!config) return null;

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting dynamic assessment:", formData);
    // Navigate strictly matching the new result route matrix
    navigate(`/result/${disease}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen p-4 py-12 bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Dynamic Assessment Page
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
         <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className={`relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl mb-6">
            <Activity size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 tracking-tight">
            {config.title} Assessment
          </h1>
          <p className="text-gray-500 mt-3 max-w-md">
            Complete this targeted diagnostic to evaluate your risk factors for {config.title.toLowerCase()}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(200,180,230,0.3)] border border-white/80 rounded-3xl p-6 sm:p-10 flex flex-col gap-8">
          
          {/* SECTION: BASIC INFO */}
          <div className="flex flex-col gap-4 border-b border-purple-100 pb-8">
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-2 flex items-center gap-2">
              <ShieldCheck size={16} /> Basic Demographics
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField 
                label="Age" 
                type="number" 
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 35" 
                required 
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Biological Sex</label>
                <ToggleGroup 
                  options={['Male', 'Female']} 
                  selected={formData.gender} 
                  onChange={(val) => handleChange('gender', val)} 
                />
              </div>
            </div>
          </div>

          {/* SECTION: DYNAMIC CLINICAL INFO */}
          <div className="flex flex-col gap-6 pt-2">
            <h2 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-2 flex items-center gap-2">
              <Activity size={16} /> Clinical Parameters
            </h2>

            {config.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                {field.type === 'number' ? (
                  <InputField 
                    label={field.label} 
                    type="number" 
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder} 
                  />
                ) : field.type === 'segmented' ? (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{field.label}</label>
                    <RadioGroup 
                      options={field.options}
                      selected={formData[field.name]}
                      onChange={(val) => handleChange(field.name, val)}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{field.label}</label>
                    <ToggleGroup 
                      options={field.options}
                      selected={formData[field.name]}
                      onChange={(val) => handleChange(field.name, val)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              className="w-full group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-[0_8px_16px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 text-lg">
                Analyze Risk <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
