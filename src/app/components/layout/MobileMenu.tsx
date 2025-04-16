"use client";
import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useLocale } from '@/app/contexts/LocaleContext';
import { useResponsive } from '@/app/hooks/useResponsive';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, children }) => {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const isRtl = locale === 'ar';
  
  // Handle click outside to close
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity">
      <div 
        ref={menuRef}
        className={`fixed top-0 ${isRtl ? 'right-0' : 'left-0'} h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out`}
        style={{
          transform: isOpen ? 'translateX(0)' : `translateX(${isRtl ? '100%' : '-100%'})`,
        }}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Menu</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
