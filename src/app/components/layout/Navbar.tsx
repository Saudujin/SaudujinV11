"use client";
import React from 'react';
import { cn } from '@/app/utils/cn';

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {children}
        </div>
      </nav>
    );
  }
);

Navbar.displayName = 'Navbar';

const NavbarLogo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      />
    );
  }
);

NavbarLogo.displayName = 'NavbarLogo';

const NavbarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center space-x-4", className)}
        {...props}
      />
    );
  }
);

NavbarContent.displayName = 'NavbarContent';

const NavbarItems = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("hidden md:flex items-center space-x-4", className)}
        {...props}
      />
    );
  }
);

NavbarItems.displayName = 'NavbarItems';

const NavbarItem = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-500 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);

NavbarItem.displayName = 'NavbarItem';

const NavbarMobileToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
          className
        )}
        aria-label="Toggle mobile menu"
        {...props}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    );
  }
);

NavbarMobileToggle.displayName = 'NavbarMobileToggle';

export { Navbar, NavbarLogo, NavbarContent, NavbarItems, NavbarItem, NavbarMobileToggle };
