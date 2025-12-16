'use client';

import { Input, InputProps, InputRef } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * PMC Input - Ant Design Input wrapper for consistent styling
 *
 * Replaces Bootstrap .w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent patterns
 * Use this for text inputs, search fields, etc.
 */

export interface PmcInputProps extends Omit<InputProps, 'size'> {
  /** Input size variant */
  inputSize?: 'small' | 'middle' | 'large';
  /** Full width input */
  fullWidth?: boolean;
  /** Error state */
  error?: boolean;
}

export const PmcInput = forwardRef<InputRef, PmcInputProps>(
  ({ inputSize = 'middle', fullWidth = true, error, className, status, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        size={inputSize}
        status={error ? 'error' : status}
        className={cn(
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

PmcInput.displayName = 'PmcInput';

/**
 * PMC TextArea - Ant Design TextArea wrapper
 *
 * Replaces Bootstrap textarea.w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent patterns
 */
export interface PmcTextAreaProps extends TextAreaProps {
  /** Full width textarea */
  fullWidth?: boolean;
  /** Error state */
  error?: boolean;
}

export const PmcTextArea = forwardRef<HTMLTextAreaElement, PmcTextAreaProps>(
  ({ fullWidth = true, error, className, status, ...props }, ref) => {
    return (
      <Input.TextArea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        status={error ? 'error' : status}
        className={cn(
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

PmcTextArea.displayName = 'PmcTextArea';

/**
 * PMC Search - Ant Design Search Input wrapper
 *
 * Replaces Bootstrap search input patterns
 */
export const PmcSearch = Input.Search;

/**
 * PMC Password - Ant Design Password Input wrapper
 *
 * Replaces Bootstrap password input patterns
 */
export const PmcPassword = Input.Password;

export default PmcInput;
