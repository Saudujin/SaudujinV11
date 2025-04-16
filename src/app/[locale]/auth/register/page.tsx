"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import RegistrationForm from '@/app/components/forms/RegistrationForm';
import { Navbar, NavbarLogo, NavbarContent } from '@/app/components/layout/Navbar';
import { ThemeSwitcher } from '@/app/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegistrationSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // First, create the user in the database
      const createUserResponse = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const userData = await createUserResponse.json();
      
      if (!createUserResponse.ok) {
        throw new Error(userData.error || 'Failed to create user');
      }
      
      // Then, send verification code
      const phoneNumber = `${data.countryCode}${data.phoneNumber}`;
      const verificationResponse = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });
      
      const verificationData = await verificationResponse.json();
      
      if (!verificationResponse.ok) {
        throw new Error(verificationData.error || 'Failed to send verification code');
      }
      
      // Store phone number for verification page
      localStorage.setItem('pendingVerificationPhone', phoneNumber);
      
      // Redirect to verification page
      router.push(`/auth/verify?phoneNumber=${encodeURIComponent(phoneNumber)}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
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
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">{t('registration.title')}</h1>
          <RegistrationForm 
            onSubmit={handleRegistrationSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
