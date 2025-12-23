
import React, { useState } from 'react';
import { Notification } from '../types';

interface NavbarProps {
  notifications: Notification[];
  onHome: () => void;
  onNotificationClick: (projectId: string) => void;
  onClearNotifications: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ notifications, onHome, onNotificationClick, onClearNotifications }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onHome}
      >
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-indigo-400 transition-colors">
          DS
        </div>
        <span className="text-xl font-bold tracking-tight text-white">DevSync</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-4 text-sm font-medium text-slate-300">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={onHome}>Projects</span>
          <span className="hover:text-white cursor-pointer transition-colors">Testers</span>
          <span className="hover:text-white cursor-pointer transition-colors">Leaderboard</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <span className="text-sm font-bold text-white">Notifications</span>
                <button 
                  onClick={onClearNotifications}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-500 text-sm italic">
                    All caught up!
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        onNotificationClick(n.projectId);
                        setShowNotifs(false);
                      }}
                      className="px-4 py-3 hover:bg-slate-700 border-b border-slate-700 cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-slate-200">{n.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
          <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-slate-600" alt="Avatar" />
          <span className="hidden sm:inline text-sm font-medium text-slate-200">Alex</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
