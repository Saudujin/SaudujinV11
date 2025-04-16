"use client";
import React from 'react';
import { cn } from '@/app/utils/cn';

interface LanguageSwitcherProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onLocaleChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        onClick={() => onLocaleChange('en')}
        className={cn(
          "px-3 py-1 rounded-md text-sm font-medium transition-colors",
          currentLocale === 'en'
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => onLocaleChange('ar')}
        className={cn(
          "px-3 py-1 rounded-md text-sm font-medium transition-colors",
          currentLocale === 'ar'
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        )}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </div>
  );
};

export { LanguageSwitcher };
