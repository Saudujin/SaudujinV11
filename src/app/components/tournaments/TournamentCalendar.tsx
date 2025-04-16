"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import TournamentCard from '@/app/components/tournaments/TournamentCard';
import TournamentFilters from '@/app/components/tournaments/TournamentFilters';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface Tournament {
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
  description?: string;
  venueInformation?: string;
  participatingTeams?: string[];
}

interface TournamentCalendarProps {
  tournaments: Tournament[];
  onRegisterTournament: (tournamentId: string) => Promise<void>;
  className?: string;
}

const TournamentCalendar: React.FC<TournamentCalendarProps> = ({
  tournaments,
  onRegisterTournament,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(tournaments);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract unique games and locations for filters
  const uniqueGames = Array.from(new Set(tournaments.map(t => t.game)));
  const uniqueLocations = Array.from(new Set(tournaments.map(t => t.location)));
  
  // Handle filter changes
  const handleFilterChange = (filters: {
    search: string;
    games: string[];
    locations: string[];
    dateRange: 'all' | 'upcoming' | 'past' | 'today' | 'thisWeek' | 'thisMonth';
    showPriorityOnly: boolean;
  }) => {
    // Filter tournaments based on criteria
    let filtered = [...tournaments];
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        t.game.toLowerCase().includes(searchLower) ||
        t.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Games filter
    if (filters.games.length > 0) {
      filtered = filtered.filter(t => filters.games.includes(t.game));
    }
    
    // Locations filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter(t => filters.locations.includes(t.location));
    }
    
    // Date range filter
    const now = new Date();
    switch (filters.dateRange) {
      case 'upcoming':
        filtered = filtered.filter(t => new Date(t.date) > now);
        break;
      case 'past':
        filtered = filtered.filter(t => new Date(t.date) < now);
        break;
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(t => {
          const tournamentDate = new Date(t.date);
          return tournamentDate >= today && tournamentDate < tomorrow;
        });
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        filtered = filtered.filter(t => {
          const tournamentDate = new Date(t.date);
          return tournamentDate >= startOfWeek && tournamentDate < endOfWeek;
        });
        break;
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filtered = filtered.filter(t => {
          const tournamentDate = new Date(t.date);
          return tournamentDate >= startOfMonth && tournamentDate <= endOfMonth;
        });
        break;
    }
    
    // Priority events filter
    if (filters.showPriorityOnly) {
      filtered = filtered.filter(t => t.isPriorityEvent);
    }
    
    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredTournaments(filtered);
  };
  
  // Handle tournament registration
  const handleRegister = async (tournamentId: string) => {
    setIsLoading(true);
    try {
      await onRegisterTournament(tournamentId);
      
      // Update local state to reflect registration
      setFilteredTournaments(prev => 
        prev.map(t => 
          t.id === tournamentId 
            ? { ...t, isUserRegistered: true, registeredCount: t.registeredCount + 1 } 
            : t
        )
      );
    } catch (error) {
      console.error('Failed to register for tournament:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{t('tournaments.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('tournaments.subtitle')}</p>
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <TournamentFilters
          games={uniqueGames}
          locations={uniqueLocations}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {/* View mode selector */}
      <div className="mb-6">
        <RtlFlex className="justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTournaments.length} {t('tournaments.found')}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              {t('tournaments.viewModes.grid')}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {t('tournaments.viewModes.list')}
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              {t('tournaments.viewModes.map')}
            </Button>
          </div>
        </RtlFlex>
      </div>
      
      {/* Tournaments display */}
      {filteredTournaments.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="text-lg font-medium mb-2">{t('tournaments.noTournamentsTitle')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('tournaments.noTournamentsDescription')}</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  {...tournament}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          )}
          
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredTournaments.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  {...tournament}
                  onRegister={handleRegister}
                  className="max-w-none"
                />
              ))}
            </div>
          )}
          
          {viewMode === 'map' && (
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">{t('tournaments.mapViewPlaceholder')}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('tournaments.mapViewDescription')}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {filteredTournaments.map(tournament => (
                    <div 
                      key={tournament.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{tournament.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {tournament.location} • {new Date(tournament.date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}
                        </div>
                      </div>
                      <Button
                        variant={tournament.isUserRegistered ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleRegister(tournament.id)}
                        disabled={tournament.isUserRegistered || isLoading}
                      >
                        {tournament.isUserRegistered ? t('tournaments.registered') : t('tournaments.register')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </RtlContainer>
  );
};

export default TournamentCalendar;
