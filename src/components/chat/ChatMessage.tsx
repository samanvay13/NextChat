import React from 'react';
import { Message } from '@/types/chat';
import { UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ThemeClasses } from '@/app/types';

interface ChatMessageProps {
  message: Message;
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, themeClasses, isDarkMode }) => {
  const isUser = message.role === 'user';
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-cyan-500' : 'bg-blue-500'} flex-shrink-0`}>
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-2xl ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? `${isDarkMode ? 'bg-cyan-500' : 'bg-blue-500'} text-white ml-12` 
            : `${themeClasses.cardBg} ${themeClasses.border} border`
        }`}>
          {message.image_url && (
            <div className="mb-3">
              <img 
                src={message.image_url} 
                alt="Shared image" 
                className="rounded-lg max-w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}
          <p className={`text-sm whitespace-pre-wrap ${isUser ? 'text-white' : themeClasses.text}`}>
            {message.content}
          </p>
        </div>
        <p className={`text-xs ${themeClasses.textMuted} mt-1 ${isUser ? 'text-right mr-12' : 'ml-2'}`}>
          {formatTime(message.created_at)}
        </p>
      </div>

      {isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.profileBg} ${themeClasses.border} border flex-shrink-0`}>
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};