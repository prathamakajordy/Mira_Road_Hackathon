import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UploadCloud, FileText, X, AlertCircle, CheckCircle2, ChevronLeft, Loader2
} from 'lucide-react';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Reusable basic "shadcn-like" UI components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border shadow-sm rounded-xl ${className}`}>
    {children}
  </div>
);

const Label = ({ children, className = '' }) => (
  <label className={`text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default function ReportUpload() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [file, setFile] = useState(null);
  const [diseaseType, setDiseaseType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Auth Check
    if (!token) {
      navigate('/auth'); // Needs to match Auth route config
    }
    setTimeout(() => setMounted(true), 100);
  }, [navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return false;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF, JPG, or PNG.');
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 10MB. Please upload a smaller file.');
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !diseaseType) return;

    setIsLoading(true);
    setError('');
    setUploadProgress(0);

    // Fake progress interval for UX since axios progress isn't reliable locally sometimes
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 500);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('diseaseType', diseaseType);
      formData.append('symptoms', symptoms);

      // Simulate network request if VITE_API_BASE_URL isn't actually bound
      // In reality: 
      /*
      const response = await axiosInstance.post('/api/report/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      */
      
      // MOCK DELAY (Replace with axios call above)
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResponse = { data: { success: true, message: "Parsed correctly" }};
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Delay slightly so 100% is visible
      setTimeout(() => {
        navigate('/report/result', { state: { reportData: mockResponse.data } });
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setIsLoading(false);
      setUploadProgress(0);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth'); // Redirect on unauthorized
      } else {
        setError(err.response?.data?.message || 'Upload failed. Please try again later.');
      }
    }
  };

  const isFormValid = file && diseaseType && !isLoading;

  return (
    <div className="relative min-h-screen bg-gray-50/50 p-4 py-12 flex flex-col items-center justify-start font-sans">
      
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Report Upload Page
      </div>

      <div className={`w-full max-w-2xl transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* Header */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload Medical Report</h1>
          <p className="text-gray-500 mt-2">Upload your report and get AI-based insights in seconds.</p>
        </div>

        {/* Main Card */}
        <Card className="p-6 sm:p-8 bg-white border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* 1) File Upload Area */}
            <div className="space-y-3">
              <Label className="text-gray-900">Medical Report <span className="text-red-500">*</span></Label>
              
              {!file ? (
                <div 
                  className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all
                    ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                  <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100 mb-4 text-purple-600">
                    <UploadCloud size={28} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-purple-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-gray-900 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  {!isLoading && (
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} /> <span>{error}</span>
                </div>
              )}
            </div>

            {/* 2) Disease Type Select */}
            <div className="space-y-3">
              <Label className="text-gray-900">Analyte Focus (Disease Type) <span className="text-red-500">*</span></Label>
              <div className="relative">
                <select 
                  value={diseaseType}
                  onChange={(e) => setDiseaseType(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-11 px-4 text-sm bg-white border border-gray-300 rounded-lg appearance-none outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:bg-gray-50"
                  required
                >
                  <option value="" disabled>Select a specific disease focus</option>
                  <option value="heart">Heart / Cardiovascular</option>
                  <option value="diabetes">Diabetes / Metabolic</option>
                  <option value="liver">Liver / Hepatic</option>
                  <option value="kidney">Kidney / Renal</option>
                  <option value="general">General Checkup</option>
                </select>
                <div className="absolute top-0 right-0 h-full px-3 flex items-center pointer-events-none text-gray-400">
                   <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            {/* 3) Symptoms Textarea */}
            <div className="space-y-3">
              <Label className="text-gray-900">Symptoms</Label>
              <div className="relative">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  disabled={isLoading}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe any symptoms you're experiencing (optional)"
                  className="w-full p-4 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none disabled:opacity-50 disabled:bg-gray-50"
                />
                <span className={`absolute bottom-3 right-3 text-xs font-semibold ${symptoms.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {symptoms.length}/500
                </span>
              </div>
            </div>

            {/* Form Actions / Progress */}
            <div className="pt-2 border-t border-gray-100 flex flex-col">
              
              {isLoading && (
                <div className="flex flex-col gap-2 mb-6 animate-in fade-in duration-300">
                   <div className="flex justify-between items-center text-sm text-purple-700 font-medium">
                     <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin"/> Analyzing your report... this may take 5–15 seconds.</span>
                     <span>{uploadProgress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                   </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Processing Document...' : 'Analyze Report'}
              </button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}
