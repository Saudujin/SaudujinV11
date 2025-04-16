"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { Checkbox } from '@/app/components/ui/Checkbox';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface TournamentFiltersProps {
  games: string[];
  locations: string[];
  onFilterChange: (filters: {
    search: string;
    games: string[];
    locations: string[];
    dateRange: 'all' | 'upcoming' | 'past' | 'today' | 'thisWeek' | 'thisMonth';
    showPriorityOnly: boolean;
  }) => void;
  className?: string;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
  games,
  locations,
  onFilterChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const { rtlClass } = useRtlStyling();
  
  const [search, setSearch] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'upcoming' | 'past' | 'today' | 'thisWeek' | 'thisMonth'>('upcoming');
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: t('tournaments.filters.dateRange.all') },
    { value: 'upcoming', label: t('tournaments.filters.dateRange.upcoming') },
    { value: 'past', label: t('tournaments.filters.dateRange.past') },
    { value: 'today', label: t('tournaments.filters.dateRange.today') },
    { value: 'thisWeek', label: t('tournaments.filters.dateRange.thisWeek') },
    { value: 'thisMonth', label: t('tournaments.filters.dateRange.thisMonth') },
  ];
  
  // Update filters when any filter changes
  useEffect(() => {
    onFilterChange({
      search,
      games: selectedGames,
      locations: selectedLocations,
      dateRange,
      showPriorityOnly,
    });
  }, [search, selectedGames, selectedLocations, dateRange, showPriorityOnly, onFilterChange]);
  
  // Handle game selection
  const handleGameChange = (game: string, checked: boolean) => {
    if (checked) {
      setSelectedGames(prev => [...prev, game]);
    } else {
      setSelectedGames(prev => prev.filter(g => g !== game));
    }
  };
  
  // Handle location selection
  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, location]);
    } else {
      setSelectedLocations(prev => prev.filter(l => l !== location));
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedGames([]);
    setSelectedLocations([]);
    setDateRange('upcoming');
    setShowPriorityOnly(false);
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t('tournaments.filters.title')}</CardTitle>
          <CardDescription>{t('tournaments.filters.subtitle')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Search and date range (always visible) */}
          <div className="mb-4">
            <RtlFlex className="gap-4">
              <div className="flex-1">
                <Input
                  label={t('tournaments.filters.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('tournaments.filters.searchPlaceholder')}
                />
              </div>
              <div className="w-1/3">
                <Select
                  label={t('tournaments.filters.dateRange.label')}
                  options={dateRangeOptions}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                />
              </div>
            </RtlFlex>
          </div>
          
          {/* Priority events checkbox */}
          <div className="mb-4">
            <Checkbox
              label={t('tournaments.filters.priorityOnly')}
              checked={showPriorityOnly}
              onChange={(e) => setShowPriorityOnly(e.target.checked)}
            />
          </div>
          
          {/* Expandable filters */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Games filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">{t('tournaments.filters.games')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {games.map((game) => (
                    <Checkbox
                      key={game}
                      label={game}
                      checked={selectedGames.includes(game)}
                      onChange={(e) => handleGameChange(game, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Locations filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">{t('tournaments.filters.locations')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locations.map((location) => (
                    <Checkbox
                      key={location}
                      label={location}
                      checked={selectedLocations.includes(location)}
                      onChange={(e) => handleLocationChange(location, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Filter actions */}
          <RtlFlex className="justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? t('tournaments.filters.showLess') : t('tournaments.filters.showMore')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              {t('tournaments.filters.clearAll')}
            </Button>
          </RtlFlex>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default TournamentFilters;
