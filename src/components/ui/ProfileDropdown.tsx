import React, { useRef, useState } from 'react';
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import { ThemeClasses } from '@/app/types';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface ProfileDropdownProps {
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ themeClasses, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(profileDropdownRef, () => setIsProfileOpen(false));

  return (
    <div className="fixed top-4 right-4 z-50" ref={profileDropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className={`flex items-center gap-3 p-3 ${themeClasses.profileBg} rounded-lg ${themeClasses.border} border ${themeClasses.hover} cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg`}
      >
        <div className={`w-8 h-8 bg-gradient-to-br ${isDarkMode ? 'from-cyan-500 to-purple-600' : 'from-blue-500 to-purple-600'} rounded-full flex items-center justify-center`}>
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div className="text-left hidden md:block">
          <div className={`text-sm font-medium ${themeClasses.text}`}>John Doe</div>
          <div className={`text-xs ${themeClasses.textMuted}`}>john@example.com</div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 ${themeClasses.textMuted} transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
      </button>

      {isProfileOpen && (
        <div className={`absolute top-full right-0 mt-2 w-64 ${themeClasses.profileBg} rounded-lg shadow-lg ${themeClasses.border} border animate-slide-up`}>
          <div className={`p-3 ${themeClasses.border} border-b`}>
            <div className={`text-sm font-medium ${themeClasses.text}`}>John Doe</div>
            <div className={`text-xs ${themeClasses.textMuted}`}>john@example.com</div>
          </div>
          <button className={`w-full text-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 ${isDarkMode ? 'hover:bg-red-900/20' : ''} rounded-b-lg cursor-pointer transition-colors`}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};