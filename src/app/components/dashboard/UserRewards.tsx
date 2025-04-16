"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';
import RewardCard from '@/app/components/loyalty/RewardCard';

interface UserRewardsProps {
  loyalty: {
    points: number;
    rewards: {
      scarf: boolean;
      vipTicket: boolean;
      jersey: boolean;
    };
  };
  className?: string;
}

const UserRewards: React.FC<UserRewardsProps> = ({
  loyalty,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  
  // Define rewards
  const rewards = [
    {
      id: 'scarf',
      title: t('loyalty.rewards.scarf'),
      description: t('loyalty.milestones.scarf'),
      pointsRequired: 1,
      image: '/images/rewards/scarf.jpg',
      isUnlocked: loyalty.rewards.scarf,
    },
    {
      id: 'vipTicket',
      title: t('loyalty.rewards.vipTicket'),
      description: t('loyalty.milestones.vipTicket'),
      pointsRequired: 3,
      image: '/images/rewards/vip-ticket.jpg',
      isUnlocked: loyalty.rewards.vipTicket,
    },
    {
      id: 'jersey',
      title: t('loyalty.rewards.jersey'),
      description: t('loyalty.milestones.jersey'),
      pointsRequired: 10,
      image: '/images/rewards/jersey.jpg',
      isUnlocked: loyalty.rewards.jersey,
    },
  ];
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.rewards.title')}</CardTitle>
          <CardDescription>{t('dashboard.rewards.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                title={reward.title}
                description={reward.description}
                pointsRequired={reward.pointsRequired}
                currentPoints={loyalty.points}
                isUnlocked={reward.isUnlocked}
                image={reward.image}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('dashboard.rewards.howToEarn')}
            </p>
            <Button as="a" href="/tournaments">
              {t('dashboard.rewards.browseTournaments')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default UserRewards;
