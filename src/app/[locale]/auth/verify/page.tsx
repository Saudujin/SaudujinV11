"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import VerificationForm from '@/app/components/forms/VerificationForm';
import { Navbar, NavbarLogo, NavbarContent } from '@/app/components/layout/Navbar';
import { ThemeSwitcher } from '@/app/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function VerificationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // Get phone number from URL query or localStorage
  const phoneNumber = router.query.phoneNumber as string || localStorage.getItem('pendingVerificationPhone') || '';
  
  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }
      
      return data;
    } catch (error) {
      console.error('Error resending verification code:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerificationSuccess = (userData: any) => {
    setVerificationSuccess(true);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('pendingVerificationPhone');
    
    // Redirect to dashboard after successful verification
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar>
        <NavbarLogo>
          <img 
            src="/logo.png" 
            alt="Falcons Supporters League" 
            className="h-8 w-auto"
            onError={(e) => {
              // Fallback if logo image is not available
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="ml-2 text-xl font-bold text-green-600">Falcons Supporters League</span>
        </NavbarLogo>
        
        <NavbarContent>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher 
              currentLocale={locale} 
              onLocaleChange={setLocale} 
            />
            <ThemeSwitcher 
              currentTheme={theme} 
              onThemeChange={toggleTheme} 
            />
          </div>
        </NavbarContent>
      </Navbar>
      
      <main className="flex-grow flex items-center justify-center p-4">
        {verificationSuccess ? (
          <div className="text-center">
            <div className="mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('verification.successMessage')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
          </div>
        ) : (
          <VerificationForm
            phoneNumber={phoneNumber}
            onVerificationSuccess={handleVerificationSuccess}
            onResendCode={handleResendCode}
          />
        )}
      </main>
    </div>
  );
}
