"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useLocale } from '@/app/contexts/LocaleContext';

// This component wraps the application to provide language direction support
interface LanguageLayoutProps {
  children: React.ReactNode;
}

const LanguageLayout: React.FC<LanguageLayoutProps> = ({ children }) => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  
  // Set document direction based on locale
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
      
      // Add RTL class to body for global styling
      if (locale === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  }, [locale]);

  return (
    <div className={`${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  );
};

export default LanguageLayout;
