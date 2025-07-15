import { useState } from 'react';
import { ThemeClasses } from '../app/types';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses: ThemeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    sidebarBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    button: isDarkMode ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/25' : 'bg-blue-600 hover:bg-blue-700',
    buttonText: 'text-white',
    inputBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardHover: isDarkMode ? 'hover:border-cyan-400 hover:shadow-cyan-500/20' : 'hover:border-blue-300 hover:shadow-md',
    neonAccent: isDarkMode ? 'text-cyan-400' : 'text-blue-600',
    toggleBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
    profileBg: isDarkMode ? 'bg-gray-800' : 'bg-white'
  };

  return { isDarkMode, toggleTheme, themeClasses };
};