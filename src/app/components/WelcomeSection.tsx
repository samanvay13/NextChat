import React from 'react';
import { ThemeClasses } from '../types';
import { ChatInput } from './ChatInput';

interface WelcomeSectionProps {
  message: string;
  setMessage: (message: string) => void;
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  message,
  setMessage,
  themeClasses,
  isDarkMode,
  onSendMessage,
  onKeyPress
}) => {
  const prompts = [
    "Help me write a professional email",
    "Explain a complex concept simply",
    "Review and improve my code",
    "Brainstorm creative ideas"
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center animate-fade-in">
        <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4 animate-slide-down`}>
          Welcome to Your AI Assistant
        </h1>
        <p className={`text-lg ${themeClasses.textSecondary} mb-8 animate-slide-up`} style={{ animationDelay: '200ms' }}>
          I'm here to help you with questions, creative projects, analysis, and more. 
          What would you like to explore today?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setMessage(prompt)}
              className={`p-4 ${themeClasses.cardBg} rounded-lg ${themeClasses.border} border ${themeClasses.cardHover} transition-all duration-200 transform hover:scale-105 animate-fade-in shadow-lg`}
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <span className={`${themeClasses.textSecondary} text-sm`}>{prompt}</span>
            </button>
          ))}
        </div>

        <ChatInput
          message={message}
          setMessage={setMessage}
          themeClasses={themeClasses}
          isDarkMode={isDarkMode}
          onSendMessage={onSendMessage}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};