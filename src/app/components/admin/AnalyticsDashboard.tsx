"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface AnalyticsDashboardProps {
  analytics: {
    totalUsers: number;
    verifiedUsers: number;
    totalTournaments: number;
    upcomingTournaments: number;
    totalRegistrations: number;
    totalAttendance: number;
    usersByLocation: {
      location: string;
      count: number;
    }[];
    usersByGame: {
      game: string;
      count: number;
    }[];
    registrationsByTournament: {
      tournamentId: string;
      tournamentTitle: string;
      registrationCount: number;
      capacity: number;
    }[];
    loyaltyDistribution: {
      tier: string;
      count: number;
    }[];
    recentActivity: {
      id: string;
      type: string;
      description: string;
      date: Date;
    }[];
  };
  onExportAnalytics: () => void;
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  onExportAnalytics,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate percentages
  const verifiedPercentage = Math.round((analytics.verifiedUsers / analytics.totalUsers) * 100) || 0;
  const attendancePercentage = Math.round((analytics.totalAttendance / analytics.totalRegistrations) * 100) || 0;
  
  return (
    <RtlContainer className={`${className}`}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.analytics.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.analytics.subtitle')}</p>
        </div>
        <Button onClick={onExportAnalytics}>
          {t('admin.analytics.exportReport')}
        </Button>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('admin.analytics.metrics.totalUsers')}
            </div>
            <div className="text-3xl font-bold">{analytics.totalUsers}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {verifiedPercentage}% {t('admin.analytics.metrics.verified')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('admin.analytics.metrics.totalTournaments')}
            </div>
            <div className="text-3xl font-bold">{analytics.totalTournaments}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {analytics.upcomingTournaments} {t('admin.analytics.metrics.upcoming')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('admin.analytics.metrics.totalRegistrations')}
            </div>
            <div className="text-3xl font-bold">{analytics.totalRegistrations}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('admin.analytics.metrics.perTournament', { 
                count: Math.round(analytics.totalRegistrations / analytics.totalTournaments) || 0
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t('admin.analytics.metrics.attendanceRate')}
            </div>
            <div className="text-3xl font-bold">{attendancePercentage}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {analytics.totalAttendance} / {analytics.totalRegistrations}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and detailed analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Users by location */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.usersByLocation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.usersByLocation.map((item) => (
                <div key={item.location}>
                  <div className="flex justify-between mb-1">
                    <span>{item.location}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${(item.count / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Users by game */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.usersByGame')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.usersByGame.map((item) => (
                <div key={item.game}>
                  <div className="flex justify-between mb-1">
                    <span>{item.game}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(item.count / analytics.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tournament registrations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('admin.analytics.registrationsByTournament')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left rtl:text-right py-3 px-4 font-medium">
                    {t('admin.analytics.tournament')}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {t('admin.analytics.registrations')}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {t('admin.analytics.capacity')}
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    {t('admin.analytics.fillRate')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.registrationsByTournament.map((tournament) => {
                  const fillRate = Math.round((tournament.registrationCount / tournament.capacity) * 100);
                  let fillRateClass = 'text-green-600';
                  if (fillRate > 90) {
                    fillRateClass = 'text-red-600';
                  } else if (fillRate > 70) {
                    fillRateClass = 'text-yellow-600';
                  }
                  
                  return (
                    <tr key={tournament.tournamentId} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">{tournament.tournamentTitle}</td>
                      <td className="py-3 px-4 text-center">{tournament.registrationCount}</td>
                      <td className="py-3 px-4 text-center">{tournament.capacity}</td>
                      <td className={`py-3 px-4 text-center font-medium ${fillRateClass}`}>
                        {fillRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Loyalty distribution */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('admin.analytics.loyaltyDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end h-64">
            {analytics.loyaltyDistribution.map((tier) => {
              const percentage = (tier.count / analytics.totalUsers) * 100;
              
              return (
                <div 
                  key={tier.tier} 
                  className="flex-1 flex flex-col items-center"
                >
                  <div 
                    className="w-full mx-1 bg-purple-500 rounded-t-md"
                    style={{ height: `${Math.max(percentage * 2, 5)}%` }}
                  ></div>
                  <div className="mt-2 text-center">
                    <div className="font-medium">{tier.tier}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tier.count} ({Math.round(percentage)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.analytics.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3 rtl:ml-3 rtl:mr-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{activity.type}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default AnalyticsDashboard;
