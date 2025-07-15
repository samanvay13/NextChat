import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'google';
  isLoading?: boolean;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  isDarkMode = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return isDarkMode
          ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25'
          : 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return isDarkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300';
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm';
      default:
        return '';
    }
  };

  const baseClasses = `w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer ${getVariantClasses()} ${className || ''}`;

  return (
    <button
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};