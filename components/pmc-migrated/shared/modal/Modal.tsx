// MIGRATION: Modal component from PackMyCode
'use client';

import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  id: string;
  title?: ReactNode;
  saveButtonText?: string | null;
  onSave?: () => void;
  children: ReactNode;
  show: boolean;
  modalFooter?: boolean;
  onClose?: () => void;
  className?: string;
  dialogClassName?: string;
  backdropStatic?: boolean;
  isSaving?: boolean;
}

export default function Modal({
  id,
  title,
  saveButtonText,
  onSave,
  children,
  show,
  modalFooter = true,
  onClose,
  className = '',
  dialogClassName = '',
  backdropStatic = false,
  isSaving = false,
}: ModalProps) {
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsStatic(false);
    }

    return () => {
      document.body.style.overflow = '';
      setIsStatic(false);
    };
  }, [show]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (backdropStatic && e.target === e.currentTarget) {
      setIsStatic(true);
      setTimeout(() => setIsStatic(false), 300);
    } else if (!backdropStatic && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className={`${styles.modal} ${className} ${show ? styles.show : styles.hide} ${
          isStatic ? styles.static : ''
        }`}
        id={id}
        tabIndex={-1}
        aria-labelledby={`${id}Label`}
        aria-hidden={!show}
        role="dialog"
        onClick={handleBackdropClick}
      >
        <div className={`${styles.modalDialog} ${dialogClassName}`}>
          <div className={styles.modalContent}>
            {title && (
              <div className={styles.modalHeader}>
                <h5 className={styles.modalTitle} id={`${id}Label`}>
                  {title}
                </h5>
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Close"
                  onClick={onClose}
                >
                  &times;
                </button>
              </div>
            )}
            <div className={styles.modalBody}>{children}</div>
            {modalFooter && (
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={onClose}>
                  Close
                </button>
                {saveButtonText && (
                  <button
                    disabled={isSaving}
                    type="button"
                    className={styles.btnPrimary}
                    onClick={onSave}
                  >
                    {!isSaving ? saveButtonText : 'Saving...'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.backdrop} />
    </>
  );
}
