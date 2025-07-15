'use client';

import React, { useState, useEffect } from 'react';
import { ChatHistoryItem } from './types';
import { useTheme } from '@/hooks/useTheme';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { UserProfile } from '@/components/layout/UserProfile';
import { Sidebar } from '@/components/ui/SideBar';
import { WelcomeSection } from '@/components/ui/WelcomeSection';
import { GlobalStyles } from '@/components/ui/GlobalStyles';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'Help with React components', timestamp: '2 hours ago' },
    { id: '2', title: 'Explain machine learning', timestamp: '1 day ago' },
    { id: '3', title: 'Code review assistance', timestamp: '3 days ago' },
    { id: '4', title: 'Database optimization', timestamp: '1 week ago' },
  ]);

  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  return (
    <div className={`flex h-screen ${themeClasses.bg} relative overflow-hidden`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <UserProfile themeClasses={themeClasses} isDarkMode={isDarkMode} />
      
      <Sidebar 
        themeClasses={themeClasses} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        chatHistory={chatHistory}
      />

      <div className="flex-1 flex flex-col relative z-10">
        <WelcomeSection
          message={message}
          setMessage={setMessage}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>

      <GlobalStyles />
    </div>
  );
}