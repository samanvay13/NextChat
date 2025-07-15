import React, { useState } from 'react';
import { PlusIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { ThemeClasses, ChatHistoryItem } from '@/app/types';

interface SidebarProps {
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
  toggleTheme: () => void;
  chatHistory: ChatHistoryItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ themeClasses, isDarkMode, toggleTheme, chatHistory }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <>
      <div 
        className={`fixed top-4 left-4 z-50 p-2 ${themeClasses.sidebarBg} rounded-lg shadow-lg ${themeClasses.border} border ${themeClasses.hover} transition-all duration-200 cursor-pointer`}
        onMouseEnter={() => setIsSidebarVisible(true)}
      >
        <svg className={`w-6 h-6 ${themeClasses.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      <div 
        className={`w-64 ${themeClasses.sidebarBg} ${themeClasses.border} border-r flex flex-col fixed left-0 top-0 h-full z-60 transition-transform duration-300 ease-in-out ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setIsSidebarVisible(false)}
      >
        <div className={`p-4 ${themeClasses.border} border-b`}>
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${themeClasses.toggleBg} rounded-lg ${themeClasses.hover} cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95`}
          >
            {isDarkMode ? (
              <>
                <SunIcon className={`w-5 h-5 ${themeClasses.textMuted}`} />
                <span className={`font-medium ${themeClasses.text}`}>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className={`w-5 h-5 ${themeClasses.textMuted}`} />
                <span className={`font-medium ${themeClasses.text}`}>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className={`p-4 ${themeClasses.border} border-b`}>
          <button className={`w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 ${themeClasses.button} ${themeClasses.buttonText} rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${isDarkMode ? 'shadow-cyan-500/25' : ''}`}>
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className={`text-sm font-medium ${themeClasses.textMuted} mb-3`}>Recent Chats</h3>
          <div className="space-y-2">
            {chatHistory.map((chat, index) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg ${themeClasses.hover} cursor-pointer transition-all duration-200 transform hover:translate-x-1 group animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`text-sm font-medium ${themeClasses.text} truncate ${themeClasses.neonAccent} group-hover:${themeClasses.neonAccent} transition-colors`}>
                  {chat.title}
                </div>
                <div className={`text-xs ${themeClasses.textMuted} mt-1`}>{chat.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};