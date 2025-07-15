import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isDarkMode?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isDarkMode, className, ...props }, ref) => {
    const baseClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    } ${error ? 'border-red-500' : ''} ${className || ''}`;

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={baseClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';