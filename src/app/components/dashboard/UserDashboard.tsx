"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { LoyaltyCircleSystem } from '@/app/components/loyalty/LoyaltyCircleSystem';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface UserDashboardProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    favoriteGames: string[];
  };
  loyalty: {
    points: number;
    maxPoints: number;
    rewards: {
      scarf: boolean;
      vipTicket: boolean;
      jersey: boolean;
    };
    attendedEvents: {
      id: string;
      tournamentId: string;
      tournamentTitle: string;
      date: Date;
      pointsEarned: number;
    }[];
  };
  upcomingTournaments: {
    id: string;
    title: string;
    game: string;
    date: Date;
    location: string;
    isRegistered: boolean;
  }[];
  className?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  loyalty,
  upcomingTournaments,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  
  return (
    <RtlContainer className={`${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {t('dashboard.welcome', { name: user.fullName })}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('dashboard.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Loyalty Circle */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('loyalty.title')}</CardTitle>
              <CardDescription>{t('loyalty.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <LoyaltyCircleSystem
                currentPoints={loyalty.points}
                maxPoints={loyalty.maxPoints}
                rewards={loyalty.rewards}
                size="md"
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming Tournaments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.upcomingTournaments')}</CardTitle>
              <CardDescription>
                {t('dashboard.upcomingTournamentsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTournaments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t('dashboard.noUpcomingTournaments')}
                  </p>
                  <Button as="a" href="/tournaments">
                    {t('dashboard.browseTournaments')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTournaments.slice(0, 3).map((tournament) => (
                    <div 
                      key={tournament.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <RtlFlex className="justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1">{tournament.title}</h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {tournament.game}
                          </div>
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {new Date(tournament.date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}
                            <span className="mx-2">•</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 text-gray-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {tournament.location}
                          </div>
                        </div>
                        <div>
                          {tournament.isRegistered ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {t('dashboard.registered')}
                            </span>
                          ) : (
                            <Button size="sm" as="a" href={`/tournaments/${tournament.id}`}>
                              {t('dashboard.register')}
                            </Button>
                          )}
                        </div>
                      </RtlFlex>
                    </div>
                  ))}
                  
                  {upcomingTournaments.length > 3 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" as="a" href="/tournaments">
                        {t('dashboard.viewAllTournaments')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Attendance History */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.attendanceHistory')}</CardTitle>
            <CardDescription>
              {t('dashboard.attendanceHistoryDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loyalty.attendedEvents.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('dashboard.noAttendanceHistory')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left rtl:text-right py-3 px-4 font-medium">{t('dashboard.tournament')}</th>
                      <th className="text-left rtl:text-right py-3 px-4 font-medium">{t('dashboard.date')}</th>
                      <th className="text-right rtl:text-left py-3 px-4 font-medium">{t('dashboard.pointsEarned')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loyalty.attendedEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">{event.tournamentTitle}</td>
                        <td className="py-3 px-4">{new Date(event.date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}</td>
                        <td className="py-3 px-4 text-right rtl:text-left font-medium text-green-600">
                          +{event.pointsEarned}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* User Profile Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.profile')}</CardTitle>
            <CardDescription>
              {t('dashboard.profileDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('registration.fullName')}
                </h3>
                <p>{user.fullName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('registration.email')}
                </h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('registration.phoneNumber')}
                </h3>
                <p>{user.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('registration.location')}
                </h3>
                <p>{user.location}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('registration.favoriteGames')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGames.map((game) => (
                  <span 
                    key={game}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" as="a" href="/profile/edit">
                {t('dashboard.editProfile')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RtlContainer>
  );
};

export default UserDashboard;
