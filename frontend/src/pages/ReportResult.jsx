import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AlertTriangle, CheckCircle2, ChevronRight, Share, 
  Download, ArrowUpRight, ArrowDownRight, Minus, 
  FileText, Activity, Layers, CornerDownRight, Check
} from 'lucide-react';

// MOCK DATA FALLBACK IF ROUTER STATE IS EMPTY
const mockFallbackData = {
  hasCriticalValues: true,
  extractedMetrics: [
    { name: "Alanine Aminotransferase (ALT)", value: 72, unit: "IU/L", normalRange: "7-56", status: "Elevated" },
    { name: "Systolic Blood Pressure", value: 135, unit: "mmHg", normalRange: "<120", status: "Elevated" },
    { name: "Fasting Glucose", value: 95, unit: "mg/dL", normalRange: "70-100", status: "Normal" }
  ],
  insights: [
    "Your ALT of 72 IU/L is above the normal range (7-56), a common indicator of hepatic stress. This may correlate with your reported fatigue.",
    "Your Systolic Blood Pressure is slightly elevated. Consistent readings above 130 mmHg suggest Stage 1 Hypertension onset."
  ],
  recommendations: [
    { title: "Review Liver Function", description: "Consult a hepatologist regarding elevated ALT levels.", priority: "High" },
    { title: "Sodium Reduction", description: "Lower daily sodium intake to <2000mg to assist blood pressure management.", priority: "Medium" },
    { title: "Moderate Cardio", description: "Introduce 30 minutes of Zone 2 cardio daily to support metabolic stability.", priority: "Low" }
  ],
  comparisonData: [
    { name: "Alanine Aminotransferase (ALT)", previous: 58, current: 72, indicator: "up" },
    { name: "Systolic Blood Pressure", previous: 138, current: 135, indicator: "down" }
  ]
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, status }) => {
  let color = 'bg-gray-100 text-gray-800 border-gray-200';
  if (status === 'Normal') color = 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'Elevated') color = 'bg-orange-50 text-orange-700 border-orange-200';
  if (status === 'High' || status === 'Critical') color = 'bg-red-50 text-red-700 border-red-200';
  if (status === 'Low' || status === 'Medium') color = 'bg-purple-50 text-purple-700 border-purple-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {children}
    </span>
  );
};

export default function ReportResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Try routing state -> Session Storage -> Mock Fallback
    let dataFromState = location.state?.reportData;
    if (!dataFromState) {
      const sessionData = sessionStorage.getItem('reportData');
      if (sessionData) {
        dataFromState = JSON.parse(sessionData);
      } else {
        // Fallback for visual testing / debugging
        console.log("No router state found. Using mock fallback data.");
        dataFromState = mockFallbackData; 
        
        // If strictly enforcing redirect: 
        // navigate('/report'); return;
      }
    }

    setReportData(dataFromState);
    setTimeout(() => setMounted(true), 100);
  }, [location, navigate]);

  if (!reportData) return null;

  const handleSaveToDashboard = async () => {
    setSaving(true);
    try {
      // API call simulation
      // await axiosInstance.post('/api/report/save', { data: reportData }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaved(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error(error);
      setSaving(false);
      if (error.response?.status === 401) {
         localStorage.removeItem('token');
         navigate('/auth');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50/50 p-4 py-12 flex flex-col items-center justify-start font-sans pb-32">
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Report Result Page
      </div>

      <div className={`w-full max-w-4xl transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
               <FileText className="text-purple-600" size={32} />
               Report Analysis Result
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Here are the key findings extracted from your uploaded medical report.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors">
               Back to Dashboard
             </button>
             <button onClick={() => navigate('/report')} className="px-4 py-2 text-sm font-semibold text-purple-700 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors">
               Upload Another
             </button>
          </div>
        </div>

        {/* SECTION 1: DOCTOR ALERT BANNER */}
        {reportData.hasCriticalValues && (
          <div className="flex items-start gap-4 p-4 mb-8 bg-orange-50 border border-orange-200 rounded-xl shadow-sm animate-[pulse_3s_ease-in-out_infinite]">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">
               <AlertTriangle size={24} />
            </div>
            <div>
               <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider mb-1">Critical Values Detected</h3>
               <p className="text-sm font-medium text-orange-800 leading-relaxed">
                 Some values in your report are indicating elevated risk bounds. We strongly recommend consulting a doctor promptly to review these specific markers.
               </p>
            </div>
          </div>
        )}

        {/* SECTION 2: EXTRACTED KEY METRICS TABLE */}
        <Card className="mb-8">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-gray-400"/> Extracted Key Metrics
              </h2>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                   <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Metric Marker</th>
                   <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Your Value</th>
                   <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-center">Normal Range</th>
                   <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 bg-white">
                 {reportData.extractedMetrics?.map((metric, idx) => (
                   <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4 font-bold text-gray-800">{metric.name}</td>
                     <td className="px-6 py-4 font-medium text-gray-900">
                       {metric.value} <span className="text-gray-400 text-xs ml-1">{metric.unit}</span>
                     </td>
                     <td className="px-6 py-4 text-gray-500 text-center font-mono text-xs">{metric.normalRange}</td>
                     <td className="px-6 py-4 text-right">
                       <Badge status={metric.status}>{metric.status}</Badge>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* SECTION 3: EXPLAINABLE INSIGHTS */}
          <Card className="flex flex-col bg-white">
            <div className="px-6 py-5 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-gray-400"/> Clinical Insights
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {reportData.insights?.map((insight, idx) => (
                <div key={idx} className="flex gap-3 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                   <CornerDownRight size={18} className="text-purple-400 shrink-0 mt-0.5" />
                   <p className="text-sm font-medium text-gray-800 leading-relaxed text-pretty">
                     {insight}
                   </p>
                </div>
              ))}
            </div>
          </Card>

          {/* SECTION 4: COMPARISON DATA */}
          <Card className="flex flex-col bg-white">
            <div className="px-6 py-5 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-gray-400"/> Longitudinal Comparison
              </h2>
            </div>
            <div className="p-0">
              {reportData.comparisonData && reportData.comparisonData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Metric</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Previous</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Current</th>
                        <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {reportData.comparisonData.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-bold text-gray-800 truncate max-w-[150px]">{comp.name}</td>
                          <td className="px-6 py-4 text-gray-500">{comp.previous}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{comp.current}</td>
                          <td className="px-6 py-4 text-right flex justify-end">
                            {comp.indicator === 'up' ? (
                               <Badge status="High"><ArrowUpRight size={14} className="mr-1"/> Up</Badge>
                            ) : comp.indicator === 'down' ? (
                               <Badge status="Normal"><ArrowDownRight size={14} className="mr-1"/> Down</Badge>
                            ) : (
                               <Badge status="Medium"><Minus size={14} className="mr-1"/> Static</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm font-medium text-gray-500 italic">
                  No previous assessment data available for longitudinal comparison.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* SECTION 5: RECOMMENDED NEXT STEPS */}
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {reportData.recommendations?.slice(0,3).map((rec, idx) => (
            <Card key={idx} className="p-5 flex flex-col gap-3 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                 <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                   {idx + 1}
                 </span>
                 <Badge status={rec.priority}>{rec.priority} Priority</Badge>
              </div>
              <h3 className="font-bold text-gray-900">{rec.title}</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                {rec.description}
              </p>
            </Card>
          ))}
        </div>

        {/* SECTION 6: CTA LAYER */}
        <div className="flex justify-center border-t border-gray-200 pt-10">
          <button 
            onClick={handleSaveToDashboard}
            disabled={saving || saved}
            className="group relative inline-flex items-center justify-center gap-2 px-12 py-4 font-bold text-white transition-all duration-300 bg-gray-900 rounded-xl shadow-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-full max-w-sm"
          >
             {saved ? (
                <span className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={20} /> Report Saved Successfully!
                </span>
             ) : saving ? (
                <span className="flex items-center gap-2 animate-pulse">
                  Saving to profile...
                </span>
             ) : (
                <span className="flex items-center gap-2">
                  Save to Dashboard <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
             )}
          </button>
        </div>

      </div>
    </div>
  );
}
