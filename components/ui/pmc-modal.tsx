'use client';

import { Modal, ModalProps } from 'antd';
import { cn } from '@/lib/utils';

/**
 * PMC Modal - Ant Design Modal wrapper for consistent styling
 *
 * Replaces Bootstrap .modal, .modal-dialog, .modal-content patterns
 * Use this for dialogs, confirmations, and forms
 */

export interface PmcModalProps extends ModalProps {
  /** Modal size preset */
  size?: 'small' | 'default' | 'large' | 'full';
}

const sizeMap: Record<string, number | string> = {
  small: 400,
  default: 520,
  large: 800,
  full: '90vw',
};

export function PmcModal({
  size = 'default',
  className,
  children,
  ...props
}: PmcModalProps) {
  return (
    <Modal
      width={sizeMap[size]}
      centered
      className={cn(className)}
      {...props}
    >
      {children}
    </Modal>
  );
}

/**
 * Confirmation modal - quick way to show confirm dialogs
 * Replaces Bootstrap modal with confirm/cancel buttons
 */
export const PmcConfirm = Modal.confirm;

/**
 * Info modal - quick way to show info messages
 */
export const PmcInfo = Modal.info;

/**
 * Success modal - quick way to show success messages
 */
export const PmcSuccess = Modal.success;

/**
 * Warning modal - quick way to show warning messages
 */
export const PmcWarning = Modal.warning;

/**
 * Error modal - quick way to show error messages
 */
export const PmcError = Modal.error;

export default PmcModal;
