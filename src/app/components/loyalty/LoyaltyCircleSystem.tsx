"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer } from '@/app/components/layout/RtlComponents';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface LoyaltyCircleProps {
  currentPoints: number;
  maxPoints: number;
  rewards: {
    scarf: boolean;
    vipTicket: boolean;
    jersey: boolean;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const LoyaltyCircleSystem: React.FC<LoyaltyCircleProps> = ({
  currentPoints,
  maxPoints,
  rewards,
  className = '',
  size = 'md',
  animated = true,
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [animatedPoints, setAnimatedPoints] = useState(0);
  
  // Calculate sizes based on the size prop
  const dimensions = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
  };
  
  const fontSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  // Milestone definitions
  const milestones = [
    { points: 1, label: t('loyalty.rewards.scarf'), achieved: rewards.scarf, position: 30 },
    { points: 3, label: t('loyalty.rewards.vipTicket'), achieved: rewards.vipTicket, position: 120 },
    { points: 10, label: t('loyalty.rewards.jersey'), achieved: rewards.jersey, position: 270 },
  ];
  
  // Calculate percentage for progress
  const percentage = Math.min((currentPoints / maxPoints) * 100, 100);
  
  // Animate points counter when currentPoints changes
  useEffect(() => {
    if (!animated) {
      setAnimatedPoints(currentPoints);
      return;
    }
    
    if (animatedPoints !== currentPoints) {
      const interval = setInterval(() => {
        setAnimatedPoints(prev => {
          if (prev < currentPoints) {
            return prev + 1;
          } else if (prev > currentPoints) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [currentPoints, animatedPoints, animated]);
  
  // Calculate circle properties
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <RtlContainer className={`${className}`}>
      <div className={`relative ${dimensions[size]} mx-auto`}>
        {/* Main circle */}
        <svg className="w-full h-full transform" viewBox="0 0 220 220">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            className="dark:opacity-20"
          />
          
          {/* Progress circle */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#16a34a"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 110 110) ${isRtl ? 'scale(-1, 1) translate(-220, 0)' : ''}`}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Milestone markers */}
          {milestones.map((milestone, index) => {
            // Calculate position on the circle
            const angle = milestone.position * (Math.PI / 180);
            const x = 110 + radius * Math.cos(angle);
            const y = 110 + radius * Math.sin(angle);
            
            return (
              <g key={index} className="transition-all duration-300">
                {/* Milestone dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={milestone.achieved ? 8 : 6}
                  fill={milestone.achieved ? "#16a34a" : "#94a3b8"}
                  stroke={milestone.achieved ? "#dcfce7" : "transparent"}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${milestone.achieved && animated ? 'animate-pulse' : ''}`}
                />
                
                {/* Milestone label */}
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fill="currentColor"
                  className={`${fontSize[size]} font-medium ${
                    milestone.achieved ? "text-green-600" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {milestone.label}
                </text>
                
                {/* Points required */}
                <text
                  x={x}
                  y={y + 40}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {t('loyalty.milestones.points', { count: milestone.points })}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${fontSize[size]}`}>
            {animatedPoints}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {maxPoints}
          </span>
          <span className="mt-2 text-green-600 font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      {/* Rewards legend */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {milestones.map((milestone, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              milestone.achieved 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="font-medium mb-1">
              {milestone.label}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('loyalty.milestones.points', { count: milestone.points })}
            </div>
            <div className={`text-sm mt-1 ${milestone.achieved ? 'text-green-600' : 'text-gray-400'}`}>
              {milestone.achieved ? t('loyalty.status.unlocked') : t('loyalty.status.locked')}
            </div>
          </div>
        ))}
      </div>
    </RtlContainer>
  );
};

export default LoyaltyCircleSystem;
