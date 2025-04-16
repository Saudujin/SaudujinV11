"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/Button';
import { useLocale } from '@/app/contexts/LocaleContext';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onRegisterClick }) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-green-900 to-green-800 text-white ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Particle effect background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-4 h-4 bg-white rounded-full animate-float top-1/4 left-1/4"></div>
        <div className="absolute w-2 h-2 bg-white rounded-full animate-float-delay top-3/4 left-1/3"></div>
        <div className="absolute w-3 h-3 bg-white rounded-full animate-float-slow top-1/2 left-2/3"></div>
        <div className="absolute w-2 h-2 bg-white rounded-full animate-float-delay-slow top-1/3 left-3/4"></div>
        <div className="absolute w-4 h-4 bg-white rounded-full animate-float-slow top-2/3 left-1/5"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('landing.hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-green-100">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick}
              className="animate-pulse-subtle hover:animate-none"
            >
              {t('landing.hero.cta')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="dark:fill-gray-900"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
