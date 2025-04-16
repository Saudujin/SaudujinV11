import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLocale } from '@/app/contexts/LocaleContext';

// Responsive design variables
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Theme colors
const colors = {
  light: {
    primary: '#16a34a', // Green-600
    secondary: '#0f766e', // Teal-700
    background: '#ffffff',
    card: '#ffffff',
    text: {
      primary: '#111827', // Gray-900
      secondary: '#4b5563', // Gray-600
      muted: '#9ca3af', // Gray-400
    },
    border: '#e5e7eb', // Gray-200
    divider: '#f3f4f6', // Gray-100
    hover: '#f9fafb', // Gray-50
    focus: 'rgba(22, 163, 74, 0.2)', // Green-600 with opacity
  },
  dark: {
    primary: '#22c55e', // Green-500
    secondary: '#14b8a6', // Teal-500
    background: '#111827', // Gray-900
    card: '#1f2937', // Gray-800
    text: {
      primary: '#f9fafb', // Gray-50
      secondary: '#e5e7eb', // Gray-200
      muted: '#6b7280', // Gray-500
    },
    border: '#374151', // Gray-700
    divider: '#1f2937', // Gray-800
    hover: '#374151', // Gray-700
    focus: 'rgba(34, 197, 94, 0.2)', // Green-500 with opacity
  },
};

// CSS variables for responsive design and theming
const createCssVariables = (theme: 'light' | 'dark') => {
  const themeColors = colors[theme];
  
  return {
    // Colors
    '--color-primary': themeColors.primary,
    '--color-secondary': themeColors.secondary,
    '--color-background': themeColors.background,
    '--color-card': themeColors.card,
    '--color-text-primary': themeColors.text.primary,
    '--color-text-secondary': themeColors.text.secondary,
    '--color-text-muted': themeColors.text.muted,
    '--color-border': themeColors.border,
    '--color-divider': themeColors.divider,
    '--color-hover': themeColors.hover,
    '--color-focus': themeColors.focus,
    
    // Spacing
    '--spacing-1': '0.25rem',
    '--spacing-2': '0.5rem',
    '--spacing-3': '0.75rem',
    '--spacing-4': '1rem',
    '--spacing-6': '1.5rem',
    '--spacing-8': '2rem',
    '--spacing-12': '3rem',
    '--spacing-16': '4rem',
    
    // Typography
    '--font-size-xs': '0.75rem',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-size-2xl': '1.5rem',
    '--font-size-3xl': '1.875rem',
    '--font-size-4xl': '2.25rem',
    
    // Border radius
    '--radius-sm': '0.125rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
    '--radius-xl': '0.75rem',
    '--radius-full': '9999px',
    
    // Shadows
    '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    
    // Transitions
    '--transition-fast': '150ms',
    '--transition-normal': '250ms',
    '--transition-slow': '350ms',
    
    // Z-index
    '--z-index-dropdown': '1000',
    '--z-index-sticky': '1020',
    '--z-index-fixed': '1030',
    '--z-index-modal-backdrop': '1040',
    '--z-index-modal': '1050',
    '--z-index-popover': '1060',
    '--z-index-tooltip': '1070',
  };
};

// Media queries for responsive design
const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  rtl: '[dir="rtl"] &',
  ltr: '[dir="ltr"] &',
};

// Responsive design utility
const responsive = {
  // Responsive padding
  padding: {
    container: {
      mobile: '1rem',
      tablet: '2rem',
      desktop: '4rem',
    },
    section: {
      mobile: '2rem',
      tablet: '3rem',
      desktop: '5rem',
    },
  },
  
  // Responsive font sizes
  fontSize: {
    heading: {
      mobile: '1.5rem',
      tablet: '2rem',
      desktop: '2.5rem',
    },
    subheading: {
      mobile: '1.25rem',
      tablet: '1.5rem',
      desktop: '1.75rem',
    },
    body: {
      mobile: '1rem',
      tablet: '1rem',
      desktop: '1.125rem',
    },
  },
  
  // Responsive grid columns
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      widescreen: 4,
    },
  },
};

// Theme provider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  
  // Apply CSS variables to :root
  React.useEffect(() => {
    const cssVariables = createCssVariables(theme);
    const root = document.documentElement;
    
    // Set direction based on locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Apply CSS variables
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Add theme class to body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Add RTL class if Arabic
    if (locale === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [theme, locale]);
  
  return <>{children}</>;
};

export { ThemeProvider, colors, breakpoints, mediaQueries, responsive };
