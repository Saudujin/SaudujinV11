"use client";
import React from 'react';
import { cn } from '@/app/utils/cn';

interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          {children}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

const FooterSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-6", className)}
        {...props}
      />
    );
  }
);

FooterSection.displayName = 'FooterSection';

const FooterTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3", className)}
        {...props}
      />
    );
  }
);

FooterTitle.displayName = 'FooterTitle';

const FooterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 mb-2",
          className
        )}
        {...props}
      />
    );
  }
);

FooterLink.displayName = 'FooterLink';

const FooterCopyright = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-500 dark:text-gray-400 mt-8", className)}
        {...props}
      />
    );
  }
);

FooterCopyright.displayName = 'FooterCopyright';

export { Footer, FooterSection, FooterTitle, FooterLink, FooterCopyright };
