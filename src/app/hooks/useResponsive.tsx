import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '@/app/styles/theme';

// Custom hook for responsive design
export function useResponsive() {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.sm });
  const isTablet = useMediaQuery({ minWidth: breakpoints.sm, maxWidth: breakpoints.lg });
  const isDesktop = useMediaQuery({ minWidth: breakpoints.lg });
  const isLargeDesktop = useMediaQuery({ minWidth: breakpoints.xl });
  
  // Determine current breakpoint
  const currentBreakpoint = 
    isLargeDesktop ? 'xl' :
    isDesktop ? 'lg' :
    isTablet ? 'md' :
    'sm';
  
  // Helper function to get responsive value based on breakpoint
  const getResponsiveValue = <T extends any>(
    values: { sm?: T; md?: T; lg?: T; xl?: T; default: T }
  ): T => {
    if (isLargeDesktop && values.xl !== undefined) return values.xl;
    if (isDesktop && values.lg !== undefined) return values.lg;
    if (isTablet && values.md !== undefined) return values.md;
    if (isMobile && values.sm !== undefined) return values.sm;
    return values.default;
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    currentBreakpoint,
    getResponsiveValue,
  };
}

// Component for responsive rendering
interface ResponsiveProps {
  children: React.ReactNode;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  mode: 'up' | 'down' | 'only';
}

export const Responsive: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint, 
  mode 
}) => {
  const { currentBreakpoint } = useResponsive();
  
  const breakpointValue = {
    sm: 0,
    md: 1,
    lg: 2,
    xl: 3
  };
  
  const currentValue = breakpointValue[currentBreakpoint];
  const targetValue = breakpointValue[breakpoint];
  
  const shouldRender = 
    mode === 'up' ? currentValue >= targetValue :
    mode === 'down' ? currentValue <= targetValue :
    currentValue === targetValue;
  
  return shouldRender ? <>{children}</> : null;
};

// Responsive container component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: { sm?: number; md?: number; lg?: number; xl?: number; default: number };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4, default: 1 },
  gap = '1rem',
  className = ''
}) => {
  const { getResponsiveValue } = useResponsive();
  const cols = getResponsiveValue(columns);
  
  return (
    <div 
      className={`grid ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap 
      }}
    >
      {children}
    </div>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: { sm?: string; md?: string; lg?: string; xl?: string; default: string };
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = { sm: '1rem', md: '1rem', lg: '1.125rem', default: '1rem' },
  className = ''
}) => {
  const { getResponsiveValue } = useResponsive();
  const fontSize = getResponsiveValue(size);
  
  return (
    <div 
      className={className}
      style={{ fontSize }}
    >
      {children}
    </div>
  );
};

export default useResponsive;
