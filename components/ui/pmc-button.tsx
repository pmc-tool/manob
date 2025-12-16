'use client';

import { Button, ButtonProps } from 'antd';
import { cn } from '@/lib/utils';

/**
 * PMC Button - Ant Design Button wrapper for consistent styling
 *
 * Replaces Bootstrap .btn, .btn-primary, .ud-btn, .btn-thm patterns
 * Use this for primary actions and form submissions
 */

export interface PmcButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  /** Button variant matching PMC design system */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  /** Full width button */
  fullWidth?: boolean;
}

const variantMap: Record<string, ButtonProps['type']> = {
  primary: 'primary',
  secondary: 'default',
  outline: 'default',
  ghost: 'text',
  link: 'link',
  danger: 'primary',
};

export function PmcButton({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: PmcButtonProps) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  return (
    <Button
      type={variantMap[variant]}
      danger={isDanger}
      ghost={isOutline}
      className={cn(
        'font-semibold',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * Primary button variant - matches .btn-thm, .ud-btn, .btn-primary
 */
export function PrimaryButton(props: Omit<PmcButtonProps, 'variant'>) {
  return <PmcButton variant="primary" {...props} />;
}

/**
 * Secondary button variant - matches .btn-secondary, .btn-default
 */
export function SecondaryButton(props: Omit<PmcButtonProps, 'variant'>) {
  return <PmcButton variant="secondary" {...props} />;
}

/**
 * Outline button variant - matches .btn-outline-*
 */
export function OutlineButton(props: Omit<PmcButtonProps, 'variant'>) {
  return <PmcButton variant="outline" {...props} />;
}

/**
 * Ghost button variant - matches .btn-ghost, icon buttons
 */
export function GhostButton(props: Omit<PmcButtonProps, 'variant'>) {
  return <PmcButton variant="ghost" {...props} />;
}

export default PmcButton;
