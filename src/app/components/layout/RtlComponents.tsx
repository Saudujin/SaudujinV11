"use client";
import React from 'react';
import { useRtlStyling } from '@/app/hooks/useMultilingual';

// Tailwind CSS RTL plugin configuration
const tailwindRtlConfig = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delay-slow': 'float 8s ease-in-out 3s infinite',
        'pulse-subtle': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
};

// RTL-aware container component
interface RtlContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const RtlContainer: React.FC<RtlContainerProps> = ({ children, className = '' }) => {
  const { isRtl } = useRtlStyling();
  
  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'} ${className}`}>
      {children}
    </div>
  );
};

// RTL-aware text component
interface RtlTextProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export const RtlText: React.FC<RtlTextProps> = ({ 
  children, 
  className = '',
  align = 'left'
}) => {
  const { rtlAlign } = useRtlStyling();
  
  const textAlignClass = align === 'center' 
    ? 'text-center' 
    : `text-${rtlAlign[align]}`;
  
  return (
    <div className={`${textAlignClass} ${className}`}>
      {children}
    </div>
  );
};

// RTL-aware flex container
interface RtlFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column';
}

export const RtlFlex: React.FC<RtlFlexProps> = ({ 
  children, 
  className = '',
  direction = 'row'
}) => {
  const { rtlFlex } = useRtlStyling();
  
  const flexDirectionClass = direction === 'column' 
    ? 'flex-col' 
    : `flex-${rtlFlex.row}`;
  
  return (
    <div className={`flex ${flexDirectionClass} ${className}`}>
      {children}
    </div>
  );
};

export { tailwindRtlConfig };
