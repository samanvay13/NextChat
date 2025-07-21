'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { UserProfile } from '@/components/layout/UserProfile';
import { Sidebar } from '@/components/ui/Sidebar'; 
import { ChatWindow } from '@/components/chat/ChatWindow';
import { GlobalStyles } from '@/components/ui/GlobalStyles';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Conversation } from './types';

export default function Home() {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user) {
      return;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${themeClasses.textMuted}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${themeClasses.textMuted}`}>Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleNewConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <div className={`flex h-screen ${themeClasses.bg} relative overflow-hidden`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <UserProfile themeClasses={themeClasses} isDarkMode={isDarkMode} />
      
      <Sidebar 
        themeClasses={themeClasses} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        currentConversation={currentConversation}
        onConversationSelect={setCurrentConversation}
      />

      <div className="flex-1 flex flex-col relative z-10 backdrop-blur-xs">
        <ChatWindow
          conversation={currentConversation}
          onNewConversation={handleNewConversation}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
        />
      </div>

      <GlobalStyles />
    </div>
  );
}