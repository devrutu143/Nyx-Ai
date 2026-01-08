
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

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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

    return () => unsubscribe();
  }, []);

  // Initialize chat sessions from local storage
  useEffect(() => {
    const savedSessions = localStorage.getItem('nyx_ai_sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse sessions", e);
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

  if (view === 'splash') {
    return <SplashScreen onComplete={() => setView(user ? 'chat' : 'auth')} />;
  }

  // Prevent black screen if still initializing Firebase after splash
  if (initializing) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
