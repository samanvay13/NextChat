'use client';

import React, { useState } from 'react';
import { ChatHistoryItem } from './types';
import { useTheme } from './hooks/useTheme';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ProfileDropdown } from './components/ProfileDropdown';
import { Sidebar } from './components/SideBar';
import { WelcomeSection } from './components/WelcomeSection';
import { GlobalStyles } from './components/GlobalStyles';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory] = useState<ChatHistoryItem[]>([
    { id: '1', title: 'Help with React components', timestamp: '2 hours ago' },
    { id: '2', title: 'Explain machine learning', timestamp: '1 day ago' },
    { id: '3', title: 'Code review assistance', timestamp: '3 days ago' },
    { id: '4', title: 'Database optimization', timestamp: '1 week ago' },
  ]);

  const { isDarkMode, toggleTheme, themeClasses } = useTheme();

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

  return (
    <div className={`flex h-screen ${themeClasses.bg} relative overflow-hidden`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <ProfileDropdown themeClasses={themeClasses} isDarkMode={isDarkMode} />
      
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