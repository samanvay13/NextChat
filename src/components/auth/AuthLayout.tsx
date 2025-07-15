import React from 'react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { useTheme } from '@/hooks/useTheme';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { isDarkMode, themeClasses } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg} relative overflow-hidden`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 border ${themeClasses.border}`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${themeClasses.textSecondary}`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};