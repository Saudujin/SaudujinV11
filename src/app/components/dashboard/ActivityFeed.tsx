"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface ActivityFeedProps {
  activities: {
    id: string;
    type: 'registration' | 'attendance' | 'reward' | 'achievement';
    title: string;
    description: string;
    date: Date;
    relatedId?: string;
    relatedType?: string;
  }[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
        );
      case 'attendance':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'reward':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
          </div>
        );
      case 'achievement':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        );
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - activityDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      return t('dashboard.activity.today');
    } else if (diffDays === 1) {
      // Yesterday
      return t('dashboard.activity.yesterday');
    } else if (diffDays < 7) {
      // This week
      return t('dashboard.activity.daysAgo', { count: diffDays });
    } else {
      // Older
      return activityDate.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US');
    }
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.activity.title')}</CardTitle>
          <CardDescription>{t('dashboard.activity.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">
                {t('dashboard.activity.noActivities')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activity.description}
                    </p>
                    {activity.relatedId && activity.relatedType && (
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          as="a"
                          href={`/${activity.relatedType}/${activity.relatedId}`}
                        >
                          {t(`dashboard.activity.view${activity.relatedType.charAt(0).toUpperCase() + activity.relatedType.slice(1)}`)}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default ActivityFeed;
