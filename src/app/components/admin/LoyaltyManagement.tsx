"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface LoyaltyManagementProps {
  users: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    loyaltyPoints: number;
    rewards: {
      scarf: boolean;
      vipTicket: boolean;
      jersey: boolean;
    };
  }[];
  onUpdateLoyaltyPoints: (userId: string, points: number) => void;
  onManuallyAwardReward: (userId: string, rewardType: 'scarf' | 'vipTicket' | 'jersey') => void;
  className?: string;
}

const LoyaltyManagement: React.FC<LoyaltyManagementProps> = ({
  users,
  onUpdateLoyaltyPoints,
  onManuallyAwardReward,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [selectedReward, setSelectedReward] = useState<'scarf' | 'vipTicket' | 'jersey'>('scarf');
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
  );
  
  // Get selected user
  const selectedUser = users.find(user => user.id === selectedUserId);
  
  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };
  
  // Handle loyalty points update
  const handleUpdatePoints = () => {
    if (selectedUserId && pointsToAdd !== 0) {
      onUpdateLoyaltyPoints(selectedUserId, pointsToAdd);
    }
  };
  
  // Handle reward award
  const handleAwardReward = () => {
    if (selectedUserId && selectedReward) {
      onManuallyAwardReward(selectedUserId, selectedReward);
    }
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.loyalty.title')}</CardTitle>
          <CardDescription>{t('admin.loyalty.subtitle')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">{t('admin.loyalty.selectUser')}</h3>
              
              <Input
                placeholder={t('admin.loyalty.searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden max-h-96 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {t('admin.loyalty.noUsersFound')}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedUserId === user.id 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email} • {user.phoneNumber}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium text-green-600">
                            {user.loyaltyPoints} {t('loyalty.points')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Loyalty management */}
            <div>
              {selectedUser ? (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
                    <h3 className="font-medium text-lg mb-2">{selectedUser.fullName}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {selectedUser.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {selectedUser.phoneNumber}
                    </div>
                    <div className="font-medium text-green-600">
                      {t('admin.loyalty.currentPoints')}: {selectedUser.loyaltyPoints}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{t('admin.loyalty.rewards')}:</span>
                      <ul className="mt-1 space-y-1">
                        <li className={selectedUser.rewards.scarf ? 'text-green-600' : 'text-gray-500'}>
                          {t('loyalty.rewards.scarf')}: {selectedUser.rewards.scarf ? t('admin.loyalty.awarded') : t('admin.loyalty.notAwarded')}
                        </li>
                        <li className={selectedUser.rewards.vipTicket ? 'text-green-600' : 'text-gray-500'}>
                          {t('loyalty.rewards.vipTicket')}: {selectedUser.rewards.vipTicket ? t('admin.loyalty.awarded') : t('admin.loyalty.notAwarded')}
                        </li>
                        <li className={selectedUser.rewards.jersey ? 'text-green-600' : 'text-gray-500'}>
                          {t('loyalty.rewards.jersey')}: {selectedUser.rewards.jersey ? t('admin.loyalty.awarded') : t('admin.loyalty.notAwarded')}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Update loyalty points */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">{t('admin.loyalty.updatePoints')}</h3>
                    <RtlFlex className="space-x-2 rtl:space-x-reverse">
                      <div className="w-1/3">
                        <Input
                          type="number"
                          value={pointsToAdd}
                          onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                          min={-selectedUser.loyaltyPoints}
                          className="text-center"
                        />
                      </div>
                      <Button
                        onClick={handleUpdatePoints}
                        disabled={pointsToAdd === 0}
                        className="flex-1"
                      >
                        {pointsToAdd > 0 
                          ? t('admin.loyalty.addPoints', { count: pointsToAdd })
                          : t('admin.loyalty.removePoints', { count: Math.abs(pointsToAdd) })
                        }
                      </Button>
                    </RtlFlex>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t('admin.loyalty.pointsDescription')}
                    </div>
                  </div>
                  
                  {/* Award reward manually */}
                  <div>
                    <h3 className="font-medium mb-3">{t('admin.loyalty.manuallyAwardReward')}</h3>
                    <RtlFlex className="space-x-2 rtl:space-x-reverse">
                      <div className="w-2/3">
                        <Select
                          value={selectedReward}
                          onChange={(e) => setSelectedReward(e.target.value as 'scarf' | 'vipTicket' | 'jersey')}
                          options={[
                            { value: 'scarf', label: t('loyalty.rewards.scarf') },
                            { value: 'vipTicket', label: t('loyalty.rewards.vipTicket') },
                            { value: 'jersey', label: t('loyalty.rewards.jersey') },
                          ]}
                        />
                      </div>
                      <Button
                        onClick={handleAwardReward}
                        disabled={selectedUser.rewards[selectedReward]}
                        className="flex-1"
                      >
                        {t('admin.loyalty.awardReward')}
                      </Button>
                    </RtlFlex>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t('admin.loyalty.rewardDescription')}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <p className="mb-2">{t('admin.loyalty.selectUserPrompt')}</p>
                    <p className="text-sm">{t('admin.loyalty.selectUserDescription')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default LoyaltyManagement;
