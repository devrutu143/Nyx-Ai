
import React, { useState } from 'react';
import { User } from '../types';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  googleProvider, 
  signInWithPopup 
} from '../services/firebase';

interface AuthProps {
  onSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      const firebaseUser = userCredential.user;
      onSuccess({ 
        email: firebaseUser.email || '', 
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=random`
      });
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "Authentication failed.";
      if (err.code === 'auth/invalid-credential') message = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') message = "Email already registered.";
      if (err.code === 'auth/weak-password') message = "Password too weak.";
      if (err.code === 'auth/unauthorized-domain') message = "Domain Not Authorized";
      setError({ message, code: err.code });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onSuccess({ 
        email: user.email || '', 
        name: user.displayName || 'Google User',
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`
      });
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError({ 
          message: "Unauthorized Domain", 
          code: 'auth/unauthorized-domain' 
        });
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError({ message: "Google sign-in failed." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black animate-in fade-in duration-700 overflow-y-auto">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          {/* CIRCULAR LOGO */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl border-2 border-white overflow-hidden p-0">
             <img src="logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Nyx Ai</h2>
          <p className="text-gray-500 text-sm tracking-wide">{isLogin ? 'Welcome back' : 'Create an account'} to begin</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-3xl animate-in zoom-in-95 duration-300">
            <p className="text-red-400 text-[15px] text-center font-bold mb-4">{error.message}</p>
            
            {error.code === 'auth/unauthorized-domain' && (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-4">
                <p className="text-[10px] text-white font-bold uppercase tracking-widest text-center">👇 COPY THIS DOMAIN 👇</p>
                <div 
                  className="bg-white text-black p-4 rounded-xl text-center font-mono text-sm font-bold break-all shadow-lg active:scale-95 transition-transform"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname);
                    alert(`Copied: ${window.location.hostname}\n\nNow paste this into your Firebase "Authorized Domains" settings.`);
                  }}
                >
                  {window.location.hostname}
                </div>
                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Go to <span className="text-white">Firebase Console > Auth > Settings > Authorized Domains</span> and add the name above.
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-[#111] border border-transparent focus:border-white/20 py-4 px-5 rounded-2xl outline-none transition-all text-white placeholder-gray-600 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-[#111] border border-transparent focus:border-white/20 py-4 px-5 rounded-2xl outline-none transition-all text-white placeholder-gray-600 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <button 
            type="submit"
            onClick={handleRipple}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm tracking-widest uppercase mt-4 active:scale-[0.97] transition-all overflow-hidden relative flex items-center justify-center shadow-xl shadow-white/5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-white/5"></div>
          <span className="px-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">Access Nyx</span>
          <div className="flex-1 border-t border-white/5"></div>
        </div>

        <button 
          onClick={(e) => { handleRipple(e); handleGoogleSignIn(); }}
          disabled={loading}
          className="w-full border border-white/10 text-white py-4 rounded-2xl font-medium text-sm flex items-center justify-center space-x-3 active:scale-[0.97] transition-all overflow-hidden relative hover:bg-white/5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="tracking-wide">Continue with Google</span>
        </button>

        <p className="mt-10 text-center text-sm">
          <span className="text-gray-500 font-medium">
            {isLogin ? "New to Nyx Ai?" : "Already joined?"}
          </span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="ml-2 text-white font-bold hover:underline"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
