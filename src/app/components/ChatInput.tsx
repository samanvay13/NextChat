import React, { useRef } from 'react';
import { PaperClipIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { ThemeClasses } from '../types';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  themeClasses,
  isDarkMode,
  onSendMessage,
  onKeyPress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className={`relative flex items-center gap-3 p-4 ${themeClasses.inputBg} rounded-2xl ${themeClasses.border} border focus-within:border-${isDarkMode ? 'cyan' : 'blue'}-300 focus-within:ring-2 focus-within:ring-${isDarkMode ? 'cyan' : 'blue'}-100 transition-all duration-200 shadow-lg`}>
          <button
            onClick={handleFileUpload}
            className={`flex-shrink-0 p-2 ${themeClasses.textMuted} hover:${themeClasses.text} ${themeClasses.hover} cursor-pointer rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95`}
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Message your AI assistant..."
            className={`flex-1 bg-transparent border-none outline-none resize-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'} max-h-32 min-h-6`}
            rows={1}
          />
          
          <button
            onClick={onSendMessage}
            disabled={!message.trim()}
            className={`flex-shrink-0 p-2 ${themeClasses.button} ${themeClasses.buttonText} cursor-pointer rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg ${isDarkMode ? 'shadow-cyan-500/25' : ''}`}
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className={`text-xs ${themeClasses.textMuted} mt-2 text-center`}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,text/*,.pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files) {
            console.log('Files selected:', e.target.files);
          }
        }}
      />
    </>
  );
};
