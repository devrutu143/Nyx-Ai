
import React, { useState, useEffect } from 'react';
import { AppView, User, ChatSession } from './types';
import SplashScreen from './components/SplashScreen';
import Auth from './components/Auth';
import ChatInterface from './components/ChatInterface';
import AboutPage from './components/AboutPage';
import { auth, onAuthStateChanged, signOut } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Global error listener to catch "process is not defined" or other crashes
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught global error:", event.error);
      setInitError(event.message);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase Auth State Changed:", firebaseUser ? "User Found" : "No User");
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=random`
        });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    // Timeout: If Firebase doesn't respond in 8 seconds, show a help message
    const timer = setTimeout(() => {
      if (initializing) {
        setInitError("Firebase is taking too long to respond. This usually means your GitHub domain isn't whitelisted in Firebase Console, or the API Key is invalid.");
      }
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [initializing]);

  // Initialize chat sessions
  useEffect(() => {
    const savedSessions = localStorage.getItem('nyx_ai_sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        setSessions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nyx_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setView('chat');
  };

  const handleSelectChat = (id: string) => {
    setCurrentSessionId(id);
    setView('chat');
  };

  // Error State Rendering
  if (initError) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-4">Launch Interrupted</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">{initError}</p>
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl w-full max-w-xs text-left mb-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Your Current Domain</p>
          <code className="text-xs text-white break-all">{window.location.hostname}</code>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (view === 'splash') {
    return <SplashScreen onComplete={() => setView(user ? 'chat' : 'auth')} />;
  }

  if (initializing) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Initializing Nyx</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative font-sans">
      {(view === 'auth' || (view === 'chat' && !user)) && (
        <Auth onSuccess={(u) => { setUser(u); setView('chat'); }} />
      )}
      
      {view === 'chat' && user && (
        <ChatInterface 
          user={user} 
          onLogout={handleLogout}
          sessions={sessions}
          setSessions={setSessions}
          currentSessionId={currentSessionId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onNavigateAbout={() => setView('about')}
        />
      )}

      {view === 'about' && (
        <AboutPage onBack={() => setView('chat')} />
      )}
    </div>
  );
};

export default App;
