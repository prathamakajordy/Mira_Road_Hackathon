import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-screen font-sans text-center px-4">
      
      <h1 className="mb-10 text-5xl md:text-7xl font-light tracking-wide text-white drop-shadow-xl select-none">
        Welcome to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-[#a855f7] to-indigo-300">Neofuture</span>
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        
        <button className="px-8 py-3.5 text-white/95 font-medium tracking-wide rounded-full bg-white/5 border border-white/20 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:bg-white/10 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 active:scale-95">
          Create / Login
        </button>

        <button 
          onClick={() => navigate('/assess/general')}
          className="px-8 py-3.5 text-white font-medium tracking-wide rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:brightness-110 hover:scale-105 transition-all duration-300 active:scale-95 border border-transparent"
        >
          Take a Quick Assessment
        </button>

      </div>
    </div>
  );
};

export default HeroSection;
