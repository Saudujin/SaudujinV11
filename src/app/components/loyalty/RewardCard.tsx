"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';

interface RewardCardProps {
  title: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
  isUnlocked: boolean;
  image?: string;
  className?: string;
}

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  pointsRequired,
  currentPoints,
  isUnlocked,
  image,
  className = '',
}) => {
  const { t } = useTranslation();
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Show celebration animation when reward is unlocked
  useEffect(() => {
    if (isUnlocked) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);
  
  // Calculate progress percentage
  const progress = Math.min((currentPoints / pointsRequired) * 100, 100);
  
  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${
        isUnlocked 
          ? 'border-green-500 dark:border-green-600 shadow-md' 
          : 'border-gray-200 dark:border-gray-700'
      } ${className}`}
    >
      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-float"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-float-delay"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/2 w-4 h-4 bg-purple-400 rounded-full animate-float-delay-slow"></div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className={isUnlocked ? 'text-green-600' : ''}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Reward image */}
        {image && (
          <div className="mb-4 h-40 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img 
              src={image} 
              alt={title} 
              className={`h-full w-auto object-cover transition-all duration-500 ${
                isUnlocked ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
              }`}
              onError={(e) => {
                // Fallback if image is not available
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full ${isUnlocked ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-1000 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Points counter */}
        <div className="flex justify-between text-sm">
          <span>{currentPoints} / {pointsRequired} {t('loyalty.points')}</span>
          <span className={isUnlocked ? 'text-green-600 font-medium' : ''}>
            {isUnlocked ? t('loyalty.status.unlocked') : t('loyalty.status.locked')}
          </span>
        </div>
        
        {/* Claim button or progress message */}
        <div className="mt-4">
          {isUnlocked ? (
            <Button variant="outline" className="w-full">
              {t('loyalty.claimReward')}
            </Button>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loyalty.needMorePoints', { count: pointsRequired - currentPoints })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
