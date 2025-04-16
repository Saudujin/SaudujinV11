"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex, RtlText } from '@/app/components/layout/RtlComponents';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { rtlClass } = useRtlStyling();
  const currentLanguage = i18n.language;
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    
    // Update HTML dir attribute for RTL support
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.body.classList.remove('rtl');
    }
    
    // Store language preference
    localStorage.setItem('language', language);
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <RtlFlex className="space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentLanguage === 'en'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('ar')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentLanguage === 'ar'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Switch to Arabic"
        >
          العربية
        </button>
      </RtlFlex>
    </RtlContainer>
  );
};

export default LanguageSelector;
