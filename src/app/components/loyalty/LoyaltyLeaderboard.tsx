"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlText } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface LoyaltyLeaderboardProps {
  leaders: {
    id: string;
    name: string;
    points: number;
    rank: number;
    avatar?: string;
  }[];
  currentUserId?: string;
  className?: string;
}

const LoyaltyLeaderboard: React.FC<LoyaltyLeaderboardProps> = ({
  leaders,
  currentUserId,
  className = '',
}) => {
  const { t } = useTranslation();
  const { rtlClass } = useRtlStyling();
  const [showAll, setShowAll] = useState(false);
  
  // Sort leaders by points (descending)
  const sortedLeaders = [...leaders].sort((a, b) => b.points - a.points);
  
  // Display top 5 by default, or all if showAll is true
  const displayedLeaders = showAll ? sortedLeaders : sortedLeaders.slice(0, 5);
  
  // Find current user in the leaderboard
  const currentUserRank = sortedLeaders.findIndex(leader => leader.id === currentUserId) + 1;
  const currentUser = sortedLeaders.find(leader => leader.id === currentUserId);
  
  // Determine if current user is in top 5
  const isCurrentUserInTop = currentUserRank > 0 && currentUserRank <= 5;
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{t('loyalty.leaderboard.title')}</CardTitle>
          <CardDescription>{t('loyalty.leaderboard.description')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Leaderboard header */}
          <div className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-sm">
            <div className="w-12 text-center">{t('loyalty.leaderboard.rank')}</div>
            <div className="flex-1">{t('loyalty.leaderboard.fan')}</div>
            <div className="w-20 text-right">{t('loyalty.leaderboard.points')}</div>
          </div>
          
          {/* Leaderboard entries */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayedLeaders.map((leader) => (
              <div 
                key={leader.id} 
                className={`flex items-center py-3 ${
                  leader.id === currentUserId 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : ''
                }`}
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  {leader.rank <= 3 ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      leader.rank === 1 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : leader.rank === 2 
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    }`}>
                      {leader.rank}
                    </span>
                  ) : (
                    <span>{leader.rank}</span>
                  )}
                </div>
                
                {/* User info */}
                <div className="flex-1 flex items-center">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2 rtl:ml-2 rtl:mr-0">
                    {leader.avatar ? (
                      <img 
                        src={leader.avatar} 
                        alt={leader.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {leader.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className={leader.id === currentUserId ? 'font-medium' : ''}>
                    {leader.name}
                    {leader.id === currentUserId && (
                      <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xs text-green-600 dark:text-green-400">
                        ({t('loyalty.leaderboard.you')})
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Points */}
                <div className="w-20 text-right font-medium">
                  {leader.points} {t('loyalty.points')}
                </div>
              </div>
            ))}
          </div>
          
          {/* Show current user's position if not in top 5 */}
          {currentUser && !isCurrentUserInTop && !showAll && (
            <>
              <div className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                • • •
              </div>
              <div className="flex items-center py-3 bg-green-50 dark:bg-green-900/20">
                {/* Rank */}
                <div className="w-12 text-center">
                  {currentUserRank}
                </div>
                
                {/* User info */}
                <div className="flex-1 flex items-center">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2 rtl:ml-2 rtl:mr-0">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="font-medium">
                    {currentUser.name}
                    <span className="ml-2 rtl:mr-2 rtl:ml-0 text-xs text-green-600 dark:text-green-400">
                      ({t('loyalty.leaderboard.you')})
                    </span>
                  </div>
                </div>
                
                {/* Points */}
                <div className="w-20 text-right font-medium">
                  {currentUser.points} {t('loyalty.points')}
                </div>
              </div>
            </>
          )}
          
          {/* Show more/less button */}
          {leaders.length > 5 && (
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? t('loyalty.leaderboard.showLess') : t('loyalty.leaderboard.showMore')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default LoyaltyLeaderboard;
