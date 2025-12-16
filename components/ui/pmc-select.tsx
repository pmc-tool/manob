'use client';

import { Select, SelectProps } from 'antd';
import { cn } from '@/lib/utils';

/**
 * PMC Select - Ant Design Select wrapper for consistent styling
 *
 * Replaces Bootstrap .form-select patterns
 * Use this for dropdown selections
 */

export interface PmcSelectProps<T = unknown> extends SelectProps<T> {
  /** Full width select */
  fullWidth?: boolean;
  /** Error state */
  error?: boolean;
}

export function PmcSelect<T = unknown>({
  fullWidth = true,
  error,
  className,
  status,
  ...props
}: PmcSelectProps<T>) {
  return (
    <Select<T>
      status={error ? 'error' : status}
      className={cn(
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}

/**
 * Re-export Select.Option for convenience
 */
export const PmcOption = Select.Option;

/**
 * Re-export Select.OptGroup for convenience
 */
export const PmcOptGroup = Select.OptGroup;

export default PmcSelect;
