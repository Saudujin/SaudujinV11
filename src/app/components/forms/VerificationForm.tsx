"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';

interface VerificationFormProps {
  phoneNumber: string;
  onVerificationSuccess: (userData: any) => void;
  onResendCode: () => Promise<void>;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ 
  phoneNumber,
  onVerificationSuccess,
  onResendCode
}) => {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError(t('common.required'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Verification failed');
      }
      
      if (data.success) {
        onVerificationSuccess(data.user);
      } else {
        setError(data.message || t('common.error'));
      }
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    
    setResendLoading(true);
    
    try {
      await onResendCode();
      
      // Start countdown for resend button (60 seconds)
      setResendCountdown(60);
      const countdownInterval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to resend code:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('verification.title')}</CardTitle>
        <CardDescription>{t('verification.subtitle')}</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleVerifyCode}>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('verification.codeLabel')} {phoneNumber}
            </p>
          </div>
          
          <Input
            label={t('verification.codeLabel')}
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              if (error) setError('');
            }}
            error={error}
            placeholder="123456"
            maxLength={6}
            className="text-center text-xl tracking-widest"
          />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('verification.submitButton')}
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full" 
            onClick={handleResendCode}
            disabled={resendLoading || resendCountdown > 0}
          >
            {resendCountdown > 0 
              ? `${t('verification.resendCode')} (${resendCountdown}s)` 
              : t('verification.resendCode')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VerificationForm;
