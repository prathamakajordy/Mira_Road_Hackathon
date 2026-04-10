import React, { useState, useEffect } from 'react';
import { InputField } from '../components/FormComponents';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'create'

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting ${activeTab}...`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#f8f5fd] via-[#fcebfa] to-[#f4e2ff] overflow-x-hidden font-sans">
      
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
         <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className={`relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(200,180,230,0.3)] border border-white/80 rounded-3xl p-8 sm:p-10 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* TABS */}
        <div className="flex relative items-center justify-between mb-8 pb-3 border-b border-purple-100/60">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 text-center font-bold text-sm tracking-wide transition-colors duration-300 ${activeTab === 'login' ? 'text-purple-700' : 'text-gray-400 hover:text-purple-500'}`}
          >
            Login
          </button>
          
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 text-center font-bold text-sm tracking-wide transition-colors duration-300 ${activeTab === 'create' ? 'text-purple-700' : 'text-gray-400 hover:text-purple-500'}`}
          >
            Create Account
          </button>

          {/* Underline Indicator */}
          <div 
            className="absolute bottom-[-1px] h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            style={{ 
              width: '50%', 
              left: activeTab === 'login' ? '0%' : '50%' 
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {activeTab === 'create' && (
            <InputField 
              label="Full Name" 
              type="text" 
              placeholder="e.g. Alex Johnson" 
            />
          )}

          <InputField 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
          />

          <InputField 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
          />

          {activeTab === 'create' && (
            <InputField 
              label="Confirm Password" 
              type="password" 
              placeholder="••••••••" 
            />
          )}

          <button 
            type="submit" 
            className="mt-6 w-full group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-[0_8px_16px_rgba(236,72,153,0.25)] hover:shadow-[0_12px_24px_rgba(236,72,153,0.4)] hover:-translate-y-0.5"
          >
            <span className="relative z-10">
              {activeTab === 'login' ? 'Access Account' : 'Create Account'}
            </span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          {activeTab === 'login' ? (
             <p className="text-sm font-medium text-gray-500">
               New here? <button onClick={() => setActiveTab('create')} className="text-purple-600 hover:text-purple-800 transition-colors">Start your journey</button>
             </p>
          ) : (
             <p className="text-sm font-medium text-gray-500">
               Already have an account? <button onClick={() => setActiveTab('login')} className="text-purple-600 hover:text-purple-800 transition-colors">Log in back</button>
             </p>
          )}
        </div>

      </div>
    </div>
  );
}
