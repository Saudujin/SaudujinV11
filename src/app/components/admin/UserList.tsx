"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface UserListProps {
  users: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    favoriteGames: string[];
    isVerified: boolean;
    loyaltyPoints: number;
    attendedEvents: number;
    registeredEvents: number;
    createdAt: Date;
  }[];
  onViewUser: (userId: string) => void;
  onExportData: (format: 'csv' | 'excel' | 'json') => void;
  className?: string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onViewUser,
  onExportData,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGame, setFilterGame] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Extract unique games and locations for filters
  const uniqueGames = Array.from(new Set(users.flatMap(user => user.favoriteGames)));
  const uniqueLocations = Array.from(new Set(users.map(user => user.location)));
  
  // Filter and sort users
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm);
    
    // Game filter
    const gameMatch = !filterGame || user.favoriteGames.includes(filterGame);
    
    // Location filter
    const locationMatch = !filterLocation || user.location === filterLocation;
    
    return searchMatch && gameMatch && locationMatch;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'fullName':
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      case 'loyaltyPoints':
        comparison = a.loyaltyPoints - b.loyaltyPoints;
        break;
      case 'attendedEvents':
        comparison = a.attendedEvents - b.attendedEvents;
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = a.fullName.localeCompare(b.fullName);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    
    return sortOrder === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block ml-1 rtl:mr-1 rtl:ml-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block ml-1 rtl:mr-1 rtl:ml-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <RtlFlex className="justify-between items-center">
            <div>
              <CardTitle>{t('admin.users.title')}</CardTitle>
              <CardDescription>{t('admin.users.subtitle')}</CardDescription>
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('csv')}
              >
                {t('admin.export.csv')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('excel')}
              >
                {t('admin.export.excel')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('json')}
              >
                {t('admin.export.json')}
              </Button>
            </div>
          </RtlFlex>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={t('admin.users.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              options={[
                { value: '', label: t('admin.users.allGames') },
                ...uniqueGames.map(game => ({ value: game, label: game }))
              ]}
            />
            
            <Select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              options={[
                { value: '', label: t('admin.users.allLocations') },
                ...uniqueLocations.map(location => ({ value: location, label: location }))
              ]}
            />
          </div>
          
          {/* User count */}
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {t('admin.users.showing', { count: sortedUsers.length, total: users.length })}
          </div>
          
          {/* Users table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left rtl:text-right py-3 px-4 font-medium">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('fullName')}
                    >
                      {t('admin.users.columns.name')}
                      {getSortIndicator('fullName')}
                    </button>
                  </th>
                  <th className="text-left rtl:text-right py-3 px-4 font-medium">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('email')}
                    >
                      {t('admin.users.columns.email')}
                      {getSortIndicator('email')}
                    </button>
                  </th>
                  <th className="text-left rtl:text-right py-3 px-4 font-medium">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('location')}
                    >
                      {t('admin.users.columns.location')}
                      {getSortIndicator('location')}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button 
                      className="flex items-center justify-center focus:outline-none"
                      onClick={() => handleSort('loyaltyPoints')}
                    >
                      {t('admin.users.columns.points')}
                      {getSortIndicator('loyaltyPoints')}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <button 
                      className="flex items-center justify-center focus:outline-none"
                      onClick={() => handleSort('attendedEvents')}
                    >
                      {t('admin.users.columns.attended')}
                      {getSortIndicator('attendedEvents')}
                    </button>
                  </th>
                  <th className="text-right rtl:text-left py-3 px-4 font-medium">
                    {t('admin.users.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.location}</td>
                    <td className="py-3 px-4 text-center font-medium">
                      {user.loyaltyPoints}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.attendedEvents} / {user.registeredEvents}
                    </td>
                    <td className="py-3 px-4 text-right rtl:text-left">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewUser(user.id)}
                      >
                        {t('admin.users.view')}
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {sortedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      {t('admin.users.noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default UserList;
