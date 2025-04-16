"use client";
import React from 'react';
import { cn } from '@/app/utils/cn';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
