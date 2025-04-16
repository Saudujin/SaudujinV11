import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import i18n from '@/app/lib/i18n';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: any) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Get locale from URL or localStorage
    const urlLocale = router.query.locale as string;
    const savedLocale = localStorage.getItem('locale');
    
    if (urlLocale && ['en', 'ar'].includes(urlLocale)) {
      setLocale(urlLocale);
    } else if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, [router.query.locale]);

  useEffect(() => {
    // Update i18n language when locale changes
    i18n.changeLanguage(locale);
    
    // Save preference to localStorage
    localStorage.setItem('locale', locale);
    
    // Update document direction for RTL support
    if (locale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [locale]);

  // Translation function
  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
