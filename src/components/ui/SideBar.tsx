import React, { useState, useEffect } from 'react';
import { PlusIcon, SunIcon, MoonIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { ThemeClasses, Conversation } from '@/app/types';
import { useChat } from '../../hooks/useChat';

interface SidebarProps {
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  themeClasses,
  isDarkMode,
  toggleTheme,
  currentConversation,
  onConversationSelect
}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { getConversations } = useChat();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const userConversations = await getConversations();
      setConversations(userConversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const handleNewChat = () => {
    onConversationSelect(null);
    setIsSidebarVisible(false);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    onConversationSelect(conversation);
    setIsSidebarVisible(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

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
        className={`w-80 ${themeClasses.sidebarBg} ${themeClasses.border} border-r flex flex-col fixed left-0 top-0 h-full z-60 transition-transform duration-300 ease-in-out ${
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
          <button 
            onClick={handleNewChat}
            className={`w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 ${themeClasses.button} ${themeClasses.buttonText} rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${isDarkMode ? 'shadow-cyan-500/25' : ''}`}
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className={`text-sm font-medium ${themeClasses.textMuted} mb-3`}>Recent Conversations</h3>
          <div className="space-y-2">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:translate-x-1 group animate-fade-in ${
                  currentConversation?.id === conversation.id 
                    ? `${themeClasses.cardHover} ${themeClasses.border} border` 
                    : themeClasses.hover
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <ChatBubbleLeftIcon className={`w-4 h-4 ${themeClasses.textMuted} mt-1 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${themeClasses.text} truncate group-hover:${themeClasses.neonAccent} transition-colors`}>
                      {conversation.title}
                    </div>
                    <div className={`text-xs ${themeClasses.textMuted} mt-1`}>
                      {formatTime(conversation.last_message_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <ChatBubbleLeftIcon className={`w-12 h-12 ${themeClasses.textMuted} mx-auto mb-3`} />
                <p className={`text-sm ${themeClasses.textMuted}`}>No conversations yet</p>
                <p className={`text-xs ${themeClasses.textMuted} mt-1`}>Start a new chat to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};