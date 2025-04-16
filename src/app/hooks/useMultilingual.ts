import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/app/contexts/LocaleContext';

// Custom hook for RTL-aware styling
export function useRtlStyling() {
  const { locale } = useLocale();
  const isRtl = locale === 'ar';
  
  // Helper function to conditionally apply RTL-specific classes
  const rtlClass = (ltrClass: string, rtlClass: string) => {
    return isRtl ? rtlClass : ltrClass;
  };
  
  // Helper for margin and padding
  const rtlSpacing = {
    ml: isRtl ? 'mr' : 'ml',
    mr: isRtl ? 'ml' : 'mr',
    pl: isRtl ? 'pr' : 'pl',
    pr: isRtl ? 'pl' : 'pr',
  };
  
  // Helper for text alignment
  const rtlAlign = {
    left: isRtl ? 'right' : 'left',
    right: isRtl ? 'left' : 'right',
  };
  
  // Helper for flex direction
  const rtlFlex = {
    row: isRtl ? 'row-reverse' : 'row',
    rowReverse: isRtl ? 'row' : 'row-reverse',
  };
  
  return {
    isRtl,
    rtlClass,
    rtlSpacing,
    rtlAlign,
    rtlFlex,
  };
}

// Custom hook for translation with namespace support
export function useTranslate(namespace?: string) {
  const { t } = useTranslation();
  
  const translate = (key: string, options?: any) => {
    if (namespace) {
      return t(`${namespace}.${key}`, options);
    }
    return t(key, options);
  };
  
  return translate;
}
