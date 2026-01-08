
import React from 'react';
import { ChatSession, User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onNavigateAbout: () => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, sessions, onSelectChat, onNewChat, onNavigateAbout, user, onLogout 
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 w-4/5 max-w-[300px] bg-[#050505] border-r border-gray-900 z-50 transform transition-transform duration-500 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* New Chat Button */}
        <div className="p-6">
          <button 
            onClick={onNewChat}
            className="w-full bg-white text-black py-3.5 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
          <p className="px-4 text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Recent History</p>
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-600 text-xs italic">No past conversations</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button 
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-gray-900 active:bg-gray-800 transition-colors group flex items-center space-x-3 overflow-hidden"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-sm truncate text-gray-400 group-hover:text-white transition-colors">{session.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-900 space-y-1">
          <button 
            onClick={onNavigateAbout}
            className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-gray-900 flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">About Nyx Ai</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-red-950/30 flex items-center space-x-3 text-gray-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-950 rounded-2xl mt-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
               <img src={user?.photoURL || 'https://picsum.photos/100'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">Founder of Personal Growth</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
