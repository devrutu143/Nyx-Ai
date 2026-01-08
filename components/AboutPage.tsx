
import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col p-8 overflow-y-auto animate-in fade-in slide-in-from-right duration-500 ease-out">
      <button 
        onClick={onBack}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 mb-8 active:scale-90 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="space-y-12 max-w-md mx-auto py-12">
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 flex items-center justify-center mx-auto mb-8 shadow-2xl overflow-hidden">
             <div className="w-full h-full rounded-full bg-white overflow-hidden border border-white">
                <img src="logo.png" alt="Nyx Logo" className="w-full h-full object-cover" />
             </div>
          </div>
          <h2 className="text-4xl font-bold text-center tracking-tight">Nyx Ai</h2>
          <div className="w-12 h-0.5 bg-white mx-auto"></div>
        </div>

        <div className="space-y-8 text-center text-lg font-light leading-relaxed text-gray-300">
          <p>Hey There, I am so happy that you decided to use my app.</p>
          
          <p>It’s me <span className="text-white font-bold">Rutu</span>, the founder of <span className="text-white">RutuDev Studio</span>.</p>
          
          <p>I make apps not from my own hard work, but by using AI tools — showing that AI is the most powerful tool in the world right now.</p>
          
          <p>I’m a <span className="text-white">16-year-old school boy</span>.</p>
          
          <p>Nice to meet you, and thank you for using “Nyx Ai”, my first app.</p>
        </div>

        <div className="pt-12 text-center space-y-2">
          <p className="text-sm tracking-widest uppercase opacity-40">Made with ❤️</p>
          <p className="text-lg font-bold">by RutuDev Studio</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
