"use client";
import React from 'react';
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
import { Checkbox } from '@/app/components/ui/Checkbox';
import { Select } from '@/app/components/ui/Select';

const games = [
  'dota2',
  'mobileLegends',
  'codWarzone',
  'apexLegends',
  'fifa25',
  'rennsport',
  'fortnite',
  'freeFire',
  'honorOfKings',
  'overwatch2',
  'pubgMobile',
  'pubgBattlegrounds',
  'rocketLeague',
  'streetFighter',
  'teamfightTactics',
  'tekken8',
];

const countryCodes = [
  { value: '+966', label: '🇸🇦 +966 (Saudi Arabia)' },
  { value: '+971', label: '🇦🇪 +971 (UAE)' },
  { value: '+974', label: '🇶🇦 +974 (Qatar)' },
  { value: '+973', label: '🇧🇭 +973 (Bahrain)' },
  { value: '+965', label: '🇰🇼 +965 (Kuwait)' },
  { value: '+968', label: '🇴🇲 +968 (Oman)' },
  { value: '+20', label: '🇪🇬 +20 (Egypt)' },
  { value: '+962', label: '🇯🇴 +962 (Jordan)' },
  { value: '+961', label: '🇱🇧 +961 (Lebanon)' },
  { value: '+1', label: '🇺🇸 +1 (USA/Canada)' },
  { value: '+44', label: '🇬🇧 +44 (UK)' },
];

interface RegistrationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSubmit,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    countryCode: '+966',
    phoneNumber: '',
    location: '',
    favoriteGames: [] as string[],
    termsAgreed: false
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'termsAgreed') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Handle favorite games checkboxes
      const gameValue = e.target.value;
      setFormData(prev => ({
        ...prev,
        favoriteGames: checked 
          ? [...prev.favoriteGames, gameValue]
          : prev.favoriteGames.filter(game => game !== gameValue)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('common.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('common.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('common.invalid');
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('common.required');
    } else if (!/^\d{8,12}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('common.invalid');
    }
    
    if (!formData.location.trim()) {
      newErrors.location = t('common.required');
    }
    
    if (formData.favoriteGames.length === 0) {
      newErrors.favoriteGames = t('common.required');
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = t('common.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('registration.title')}</CardTitle>
        <CardDescription>{t('registration.subtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label={t('registration.fullName')}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          
          <Input
            label={t('registration.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <div className="flex space-x-2">
            <div className="w-1/3">
              <Select
                label={t('registration.phoneNumber')}
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                options={countryCodes}
              />
            </div>
            <div className="w-2/3">
              <Input
                label="&nbsp;"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
              />
            </div>
          </div>
          
          <Input
            label={t('registration.location')}
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('registration.favoriteGames')}
              {errors.favoriteGames && (
                <span className="text-red-500 ml-1 text-xs">({errors.favoriteGames})</span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {games.map(game => (
                <Checkbox
                  key={game}
                  label={t(`games.${game}`)}
                  name={`game-${game}`}
                  value={game}
                  checked={formData.favoriteGames.includes(game)}
                  onChange={handleCheckboxChange}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <Checkbox
              label={t('registration.termsAgree')}
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleCheckboxChange}
            />
            {errors.termsAgreed && (
              <p className="mt-1 text-sm text-red-500">{errors.termsAgreed}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('registration.submitButton')}
          </Button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('registration.loginPrompt')} <a href="#" className="text-green-600 hover:underline">{t('registration.loginLink')}</a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegistrationForm;
