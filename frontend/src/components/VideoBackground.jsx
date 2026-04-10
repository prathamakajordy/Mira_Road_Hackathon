import { useState, useEffect } from 'react';

const VideoBackground = () => {
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    // EITHER do ONE of the following: Option A (Preferred). Reduce darkness smoothly after ~1-2 seconds.
    const timer = setTimeout(() => {
      setOpacity(0.3);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <video
        src="/finallpvideo.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      {/* Dark overlay with transition */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: `rgba(10, 10, 20, ${opacity})`,
          zIndex: 0,
          transition: 'background-color 2s ease-in-out',
          pointerEvents: 'none'
        }}
      />
    </>
  );
};

export default VideoBackground;
