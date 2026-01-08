
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 500);
    const timer2 = setTimeout(() => setPhase(2), 2500);
    const timer3 = setTimeout(() => onComplete(), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${phase === 2 ? 'opacity-0' : 'opacity-100'}`}>
      {/* CIRCULAR LOGO FRAME */}
      <div 
        className={`w-40 h-40 rounded-full border-2 border-white/20 p-1 flex items-center justify-center mb-8 transition-all duration-1000 ease-out transform shadow-[0_0_50px_rgba(255,255,255,0.1)]
          ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white shadow-xl">
          <img 
            src="logo.png" 
            alt="Nyx Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Nyx&background=000&color=fff&size=512';
            }}
          />
        </div>
      </div>
      
      <h1 className={`text-4xl font-bold tracking-[0.2em] transition-all duration-1000 delay-300 transform
        ${phase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        NYX AI
      </h1>
      
      <div className="absolute bottom-12 flex flex-col items-center">
        <div className="w-1 h-1 bg-white rounded-full animate-bounce mb-2"></div>
        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Powered by RutuDev Studio</p>
      </div>
    </div>
  );
};

export default SplashScreen;
