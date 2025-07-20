import React, { useState, useRef } from 'react';
import { ArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ThemeClasses } from '@/app/types';

interface ChatInputProps {
  onSendMessage: (message: string, imageFile?: File) => void;
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  themeClasses,
  isDarkMode,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (message.trim() || selectedImage) {
      onSendMessage(message, selectedImage || undefined);
      setMessage('');
      removeImage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-32 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className={`relative flex items-center gap-3 p-4 ${themeClasses.inputBg} rounded-2xl border ${themeClasses.border} focus-within:border-${isDarkMode ? 'cyan' : 'blue'}-300 focus-within:ring-2 focus-within:ring-${isDarkMode ? 'cyan' : 'blue'}-100 transition-all duration-200 shadow-sm`}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`flex-shrink-0 p-2 ${themeClasses.textMuted} hover:${themeClasses.text} ${themeClasses.hover} rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50`}
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about an image or type a message..."
            disabled={disabled}
            className={`flex-1 bg-transparent border-none outline-none resize-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'} max-h-32 min-h-6 disabled:opacity-50`}
            rows={1}
          />
          
          <button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && !selectedImage)}
            className={`flex-shrink-0 p-2 ${themeClasses.button} ${themeClasses.buttonText} rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg ${isDarkMode ? 'shadow-cyan-500/25' : ''}`}
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className={`text-xs ${themeClasses.textMuted} mt-2 text-center`}>
          Press Enter to send, Shift+Enter for new line. Upload images for AI analysis.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};