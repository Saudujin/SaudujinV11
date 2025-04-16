"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer, RtlFlex } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

interface AttendanceApprovalProps {
  attendanceRequests: {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    tournamentId: string;
    tournamentTitle: string;
    tournamentDate: Date;
    tournamentLocation: string;
    registrationDate: Date;
    status: 'pending' | 'approved' | 'rejected' | 'attended';
  }[];
  onApprove: (attendanceId: string) => void;
  onReject: (attendanceId: string) => void;
  onMarkAttended: (attendanceId: string) => void;
  onViewUser: (userId: string) => void;
  onViewTournament: (tournamentId: string) => void;
  className?: string;
}

const AttendanceApproval: React.FC<AttendanceApprovalProps> = ({
  attendanceRequests,
  onApprove,
  onReject,
  onMarkAttended,
  onViewUser,
  onViewTournament,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTournament, setFilterTournament] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  
  // Extract unique tournaments for filter
  const uniqueTournaments = Array.from(
    new Set(attendanceRequests.map(req => req.tournamentTitle))
  ).map(title => ({
    title,
    id: attendanceRequests.find(req => req.tournamentTitle === title)?.tournamentId || ''
  }));
  
  // Filter attendance requests
  const filteredRequests = attendanceRequests.filter(req => {
    // Search filter
    const searchMatch = 
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userPhone.includes(searchTerm) ||
      req.tournamentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tournament filter
    const tournamentMatch = !filterTournament || req.tournamentId === filterTournament;
    
    // Status filter
    const statusMatch = !filterStatus || req.status === filterStatus;
    
    return searchMatch && tournamentMatch && statusMatch;
  });
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {t('admin.attendance.status.pending')}
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {t('admin.attendance.status.approved')}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {t('admin.attendance.status.rejected')}
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t('admin.attendance.status.attended')}
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <RtlContainer className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.attendance.title')}</CardTitle>
          <CardDescription>{t('admin.attendance.subtitle')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={t('admin.attendance.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              value={filterTournament}
              onChange={(e) => setFilterTournament(e.target.value)}
              options={[
                { value: '', label: t('admin.attendance.allTournaments') },
                ...uniqueTournaments.map(tournament => ({ 
                  value: tournament.id, 
                  label: tournament.title 
                }))
              ]}
            />
            
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: '', label: t('admin.attendance.allStatuses') },
                { value: 'pending', label: t('admin.attendance.status.pending') },
                { value: 'approved', label: t('admin.attendance.status.approved') },
                { value: 'rejected', label: t('admin.attendance.status.rejected') },
                { value: 'attended', label: t('admin.attendance.status.attended') },
              ]}
            />
          </div>
          
          {/* Request count */}
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {t('admin.attendance.showing', { 
              count: filteredRequests.length, 
              total: attendanceRequests.length 
            })}
          </div>
          
          {/* Attendance requests */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('admin.attendance.noRequests')}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div 
                  key={request.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <RtlFlex className="justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">
                        <button 
                          className="hover:underline focus:outline-none"
                          onClick={() => onViewUser(request.userId)}
                        >
                          {request.userName}
                        </button>
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.userEmail} • {request.userPhone}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </RtlFlex>
                  
                  <div className="mb-4">
                    <div className="font-medium">
                      <button 
                        className="hover:underline focus:outline-none"
                        onClick={() => onViewTournament(request.tournamentId)}
                      >
                        {request.tournamentTitle}
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(request.tournamentDate)}
                      <span className="mx-2">•</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {request.tournamentLocation}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t('admin.attendance.registeredOn', { 
                      date: formatDate(request.registrationDate) 
                    })}
                  </div>
                  
                  <RtlFlex className="justify-end space-x-2 rtl:space-x-reverse">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject(request.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                          {t('admin.attendance.reject')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onApprove(request.id)}
                          className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                        >
                          {t('admin.attendance.approve')}
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => onMarkAttended(request.id)}
                      >
                        {t('admin.attendance.markAttended')}
                      </Button>
                    )}
                    
                    {request.status === 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(request.id)}
                      >
                        {t('admin.attendance.changeToApproved')}
                      </Button>
                    )}
                    
                    {request.status === 'attended' && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        {t('admin.attendance.alreadyAttended')}
                      </Button>
                    )}
                  </RtlFlex>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default AttendanceApproval;
