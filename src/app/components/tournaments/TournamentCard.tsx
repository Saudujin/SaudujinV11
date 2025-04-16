"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface TournamentCardProps {
  id: string;
  title: string;
  game: string;
  date: Date;
  location: string;
  capacity: number;
  registeredCount: number;
  loyaltyPoints: number;
  isPriorityEvent: boolean;
  isUserRegistered: boolean;
  onRegister: (tournamentId: string) => void;
  className?: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  id,
  title,
  game,
  date,
  location,
  capacity,
  registeredCount,
  loyaltyPoints,
  isPriorityEvent,
  isUserRegistered,
  onRegister,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [capacityPercentage, setCapacityPercentage] = useState<number>(0);
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format time
  const formattedTime = new Date(date).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Calculate time left until tournament
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(date).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft(t('tournaments.started'));
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(t('tournaments.timeLeft.days', { count: days }));
      } else if (hours > 0) {
        setTimeLeft(t('tournaments.timeLeft.hours', { count: hours }));
      } else {
        setTimeLeft(t('tournaments.timeLeft.minutes', { count: minutes }));
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [date, t]);
  
  // Calculate capacity percentage
  useEffect(() => {
    setCapacityPercentage(Math.min((registeredCount / capacity) * 100, 100));
  }, [registeredCount, capacity]);
  
  // Handle calendar add
  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const eventTitle = title;
    const eventDescription = `${game} tournament at ${location}`;
    const eventStart = new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
    const eventEnd = new Date(new Date(date).getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    
    // Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(location)}&dates=${eventStart}/${eventEnd}`;
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  // Get game-specific background and icon
  const getGameBackground = () => {
    switch (game.toLowerCase()) {
      case 'dota 2':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'fifa 25':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'fortnite':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'call of duty: warzone':
        return 'bg-gray-50 dark:bg-gray-800/50';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isPriorityEvent ? 'border-green-500 dark:border-green-600' : ''}`}>
        {/* Priority event badge */}
        {isPriorityEvent && (
          <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-md rtl:rounded-bl-none rtl:rounded-br-md">
            {t('tournaments.priorityEvent')}
          </div>
        )}
        
        {/* Game-specific header */}
        <div className={`p-4 ${getGameBackground()}`}>
          <RtlFlex className="justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{game}</p>
            </div>
            <div className="text-right rtl:text-left">
              <div className="text-sm font-medium">{formattedDate}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{formattedTime}</div>
            </div>
          </RtlFlex>
        </div>
        
        <CardContent className="p-4">
          {/* Location and countdown */}
          <RtlFlex className="justify-between items-center mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-1 rtl:ml-1 rtl:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-sm">{location}</span>
            </div>
            <div className="text-sm font-medium text-green-600">
              {timeLeft}
            </div>
          </RtlFlex>
          
          {/* Capacity indicator */}
          <div className="mb-4">
            <RtlFlex className="justify-between text-sm mb-1">
              <span>{t('tournaments.registered')}: {registeredCount}/{capacity}</span>
              <span className={capacityPercentage > 80 ? 'text-red-500' : capacityPercentage > 50 ? 'text-yellow-500' : 'text-green-500'}>
                {Math.round(capacityPercentage)}%
              </span>
            </RtlFlex>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  capacityPercentage > 80 ? 'bg-red-500' : capacityPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Loyalty points */}
          <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/10 rounded-md text-center">
            <span className="text-sm">
              {t('tournaments.loyaltyPoints')}: 
              <span className="font-bold text-green-600 ml-1 rtl:mr-1 rtl:ml-0">
                +{loyaltyPoints}
              </span>
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCalendar}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {t('tournaments.addToCalendar')}
          </Button>
          
          <Button
            variant={isUserRegistered ? "outline" : "default"}
            onClick={() => onRegister(id)}
            disabled={isUserRegistered}
            className={isUserRegistered ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" : ""}
          >
            {isUserRegistered ? t('tournaments.registered') : t('tournaments.register')}
          </Button>
        </CardFooter>
      </Card>
    </RtlContainer>
  );
};

export default TournamentCard;
