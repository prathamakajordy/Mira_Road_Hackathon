import React from 'react';
import VideoBackground from '../components/VideoBackground';
import HeroSection from '../components/HeroSection';

export default function Landing() {
  return (
    <>
      <div className="fixed top-0 left-0 bg-black text-white px-2 py-1 z-[9999] text-xs font-mono">
        Landing Page
      </div>
      <VideoBackground />
      <HeroSection />
    </>
  );
}
