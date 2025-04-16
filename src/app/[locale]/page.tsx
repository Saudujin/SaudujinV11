"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '@/app/components/landing/HeroSection';
import FeaturesSection from '@/app/components/landing/FeaturesSection';
import RegistrationForm from '@/app/components/forms/RegistrationForm';
import { Navbar, NavbarLogo, NavbarContent, NavbarItems, NavbarItem, NavbarMobileToggle } from '@/app/components/layout/Navbar';
import { Footer, FooterSection, FooterTitle, FooterLink, FooterCopyright } from '@/app/components/layout/Footer';
import { ThemeSwitcher } from '@/app/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/app/components/ui/LanguageSwitcher';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLocale } from '@/app/contexts/LocaleContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [showRegistration, setShowRegistration] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  
  const handleRegisterClick = () => {
    setShowRegistration(true);
    // Scroll to registration form
    setTimeout(() => {
      document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleRegistrationSubmit = async (data: any) => {
    setRegistrationLoading(true);
    
    try {
      // This will be replaced with actual API call in the phone verification implementation
      console.log('Registration data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to verification page (will be implemented in next step)
      alert(t('registration.successMessage'));
    } catch (error) {
      console.error('Registration error:', error);
      alert(t('common.error'));
    } finally {
      setRegistrationLoading(false);
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
          <NavbarItems>
            <NavbarItem href="#features">{t('landing.features.title')}</NavbarItem>
            <NavbarItem href="#registration">{t('registration.title')}</NavbarItem>
            <NavbarItem href="#loyalty">{t('loyalty.title')}</NavbarItem>
          </NavbarItems>
          
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
          
          <NavbarMobileToggle onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </NavbarContent>
      </Navbar>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <NavbarItem href="#features" onClick={() => setMobileMenuOpen(false)}>
              {t('landing.features.title')}
            </NavbarItem>
            <NavbarItem href="#registration" onClick={() => setMobileMenuOpen(false)}>
              {t('registration.title')}
            </NavbarItem>
            <NavbarItem href="#loyalty" onClick={() => setMobileMenuOpen(false)}>
              {t('loyalty.title')}
            </NavbarItem>
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        <HeroSection onRegisterClick={handleRegisterClick} />
        
        <div id="features">
          <FeaturesSection />
        </div>
        
        {showRegistration && (
          <div id="registration-section" className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('registration.title')}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('registration.subtitle')}
                </p>
              </div>
              
              <RegistrationForm 
                onSubmit={handleRegistrationSubmit}
                isLoading={registrationLoading}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterSection>
            <FooterTitle>{t('common.welcome')}</FooterTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Falcons Supporters League - EWC 2025
            </p>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Links</FooterTitle>
            <FooterLink href="#features">{t('landing.features.title')}</FooterLink>
            <FooterLink href="#registration">{t('registration.title')}</FooterLink>
            <FooterLink href="#loyalty">{t('loyalty.title')}</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Games</FooterTitle>
            <FooterLink href="#">{t('games.dota2')}</FooterLink>
            <FooterLink href="#">{t('games.fifa25')}</FooterLink>
            <FooterLink href="#">{t('games.fortnite')}</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <FooterLink href="mailto:support@falcons.com">support@falcons.com</FooterLink>
            <FooterLink href="tel:+966123456789">+966 12 345 6789</FooterLink>
          </FooterSection>
        </div>
        
        <FooterCopyright>
          © {new Date().getFullYear()} Falcons Supporters League. All rights reserved.
        </FooterCopyright>
      </Footer>
    </div>
  );
}
