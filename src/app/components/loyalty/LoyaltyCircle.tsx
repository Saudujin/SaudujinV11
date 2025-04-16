"use client";
import React from 'react';
import { cn } from '@/app/utils/cn';

interface LoyaltyCircleProps {
  currentPoints: number;
  totalPointsNeeded: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  rewards?: {
    scarf: boolean;
    vipTicket: boolean;
    jersey: boolean;
  };
}

const LoyaltyCircle: React.FC<LoyaltyCircleProps> = ({
  currentPoints,
  totalPointsNeeded,
  className,
  size = 'md',
  showLabels = true,
  rewards = { scarf: false, vipTicket: false, jersey: false },
}) => {
  const percentage = Math.min((currentPoints / totalPointsNeeded) * 100, 100);
  
  // Calculate sizes based on the size prop
  const dimensions = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };
  
  const strokeWidth = {
    sm: 8,
    md: 10,
    lg: 12,
  };
  
  const fontSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  // Calculate the circumference of the circle
  const radius = size === 'sm' ? 56 : size === 'md' ? 88 : 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Reward milestone positions
  const milestones = [
    { points: 1, label: 'Scarf', achieved: rewards.scarf, rotation: 36 },
    { points: 3, label: 'VIP Ticket', achieved: rewards.vipTicket, rotation: 108 },
    { points: 10, label: 'Jersey', achieved: rewards.jersey, rotation: 324 },
  ];

  return (
    <div className={cn("relative", dimensions[size], className)}>
      {/* Background circle */}
      <svg className="w-full h-full" viewBox="0 0 240 240">
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth[size]}
          className="dark:opacity-10"
        />
        
        {/* Progress circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="#16a34a"
          strokeWidth={strokeWidth[size]}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 120 120)"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Milestone markers */}
        {milestones.map((milestone, index) => {
          const milestonePercentage = (milestone.points / totalPointsNeeded) * 100;
          const angle = (milestonePercentage / 100) * 360 - 90;
          const x = 120 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 120 + radius * Math.sin((angle * Math.PI) / 180);
          
          return (
            <g key={index} className="transition-all duration-300">
              <circle
                cx={x}
                cy={y}
                r={milestone.achieved ? (size === 'sm' ? 6 : size === 'md' ? 8 : 10) : (size === 'sm' ? 4 : size === 'md' ? 6 : 8)}
                fill={milestone.achieved ? "#16a34a" : "#94a3b8"}
                stroke={milestone.achieved ? "#dcfce7" : "transparent"}
                strokeWidth={2}
                className={cn(
                  "transition-all duration-300",
                  milestone.achieved && "animate-pulse"
                )}
              />
              
              {showLabels && (
                <text
                  x={x}
                  y={y + (size === 'sm' ? 16 : size === 'md' ? 20 : 24)}
                  textAnchor="middle"
                  fill="currentColor"
                  className={cn(
                    fontSize[size],
                    "font-medium",
                    milestone.achieved ? "text-green-600" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {milestone.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", {
          'text-xl': size === 'sm',
          'text-3xl': size === 'md',
          'text-4xl': size === 'lg',
        })}>
          {currentPoints}
        </span>
        <span className={cn("text-gray-500 dark:text-gray-400", {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        })}>
          / {totalPointsNeeded}
        </span>
        <span className={cn("mt-1 text-green-600 font-medium", {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        })}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export { LoyaltyCircle };
