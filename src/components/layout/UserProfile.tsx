'use client';

import React, { useRef, useState } from 'react';
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon , UserCircleIcon } from '@heroicons/react/24/outline';
import { ThemeClasses } from '@/app/types'; 
import { useOutsideClick } from '@/hooks/useOutsideClick'; 
import { useAuthContext } from '../auth/AuthProvider'; 

interface UserProfileProps {
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ themeClasses, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuthContext();

  useOutsideClick(profileDropdownRef, () => setIsProfileOpen(false));

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.first_name) {
      const lastName = user?.user_metadata?.last_name;
      return lastName ? `${user.user_metadata.first_name} ${lastName}` : user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const displayName = getDisplayName();
  const displayEmail = user?.email || '';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="fixed top-4 right-4 z-50" ref={profileDropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className={`flex items-center gap-3 p-3 ${themeClasses.profileBg} rounded-lg ${themeClasses.border} border ${themeClasses.hover} cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
          avatarUrl ? '' : `bg-gradient-to-br ${isDarkMode ? 'from-cyan-500 to-purple-600' : 'from-blue-500 to-purple-600'}`
        }`}>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="text-left hidden md:block">
          <div className={`text-sm font-medium ${themeClasses.text} truncate max-w-32`}>
            {displayName}
          </div>
          <div className={`text-xs ${themeClasses.textMuted} truncate max-w-32`}>
            {displayEmail}
          </div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 ${themeClasses.textMuted} transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
      </button>

      {isProfileOpen && (
        <div className={`absolute top-full right-0 mt-2 w-64 ${themeClasses.profileBg} rounded-lg shadow-lg ${themeClasses.border} border animate-slide-up`}>
          <div className={`p-4 ${themeClasses.border} border-b`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                avatarUrl ? '' : `bg-gradient-to-br ${isDarkMode ? 'from-cyan-500 to-purple-600' : 'from-blue-500 to-purple-600'}`
              }`}>
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${themeClasses.text} truncate`}>
                  {displayName}
                </div>
                <div className={`text-xs ${themeClasses.textMuted} truncate`}>
                  {displayEmail}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm ${themeClasses.hover} rounded-lg transition-colors text-left`}
            >
              <UserCircleIcon className={`w-4 h-4 ${themeClasses.textMuted}`} />
              <span className={themeClasses.text}>Profile Settings</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
            >
              <ArrowRightOnRectangleIcon  className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};