
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatSession, Message } from '../types';
import Sidebar from './Sidebar';
import { generateAiResponse } from '../services/gemini';

interface ChatInterfaceProps {
  user: User | null;
  onLogout: () => void;
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  currentSessionId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onNavigateAbout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  user, onLogout, sessions, setSessions, currentSessionId, onSelectChat, onNewChat, onNavigateAbout
}) => {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === currentSessionId) || null;
  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    let updatedSession: ChatSession;
    const sessionToUpdate = activeSession || {
      id: Date.now().toString(),
      title: input.substring(0, 30),
      messages: [],
      updatedAt: Date.now(),
    };

    updatedSession = {
      ...sessionToUpdate,
      messages: [...sessionToUpdate.messages, userMessage],
      updatedAt: Date.now(),
    };

    // Update state
    if (!activeSession) {
      setSessions([updatedSession, ...sessions]);
      onSelectChat(updatedSession.id);
    } else {
      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    }

    const userInput = input;
    setInput('');
    setIsThinking(true);

    // Get AI Response
    const history = updatedSession.messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));
    
    // We already added the user message to history, let's remove the last one since generateAiResponse adds it
    history.pop();

    const aiText = await generateAiResponse(userInput, history);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiText,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === updatedSession.id) {
        return {
          ...s,
          messages: [...s.messages, aiMessage],
          updatedAt: Date.now()
        };
      }
      return s;
    }));

    setIsThinking(false);
  };

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

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        onSelectChat={(id) => { onSelectChat(id); setIsSidebarOpen(false); }}
        onNewChat={() => { onNewChat(); setIsSidebarOpen(false); }}
        onNavigateAbout={() => { onNavigateAbout(); setIsSidebarOpen(false); }}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-900 bg-black/80 backdrop-blur-md z-10 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold tracking-wide">Nyx Ai</h1>
          
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            <img src={user?.photoURL || 'https://picsum.photos/100'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 flex items-center justify-center mb-6 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white">
                  <img src="logo.png" alt="Nyx" className="w-full h-full object-cover" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Hello, {user?.name}</h2>
              <p className="text-gray-500 text-sm max-w-[240px]">I am Nyx. How can I assist you in your creative journey today?</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-white text-black font-medium rounded-tr-none' 
                      : 'bg-[#111] text-white border border-gray-800 rounded-tl-none'}
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isThinking && (
            <div className="flex w-full justify-start animate-in fade-in duration-300">
              <div className="bg-[#111] border border-gray-800 px-5 py-4 rounded-2xl rounded-tl-none flex space-x-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/95 backdrop-blur-md sticky bottom-0 border-t border-gray-900">
          <div className="relative flex items-center bg-[#111] border border-gray-800 rounded-2xl overflow-hidden focus-within:border-gray-500 transition-colors">
            <textarea 
              rows={1}
              placeholder="Message Nyx..."
              className="w-full bg-transparent py-4 pl-5 pr-14 text-[15px] outline-none resize-none no-scrollbar max-h-32"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button 
              onClick={(e) => { handleRipple(e); handleSendMessage(); }}
              disabled={!input.trim() || isThinking}
              className={`absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all overflow-hidden relative
                ${input.trim() && !isThinking ? 'bg-white text-black' : 'text-gray-600'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
