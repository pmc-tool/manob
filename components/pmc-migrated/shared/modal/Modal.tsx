// MIGRATION: Modal component from manob.ai - converted to Tailwind CSS
'use client';

import { MouseEvent, ReactNode, useEffect, useState } from 'react';

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
        className={`fixed inset-0 z-[1050] flex items-center justify-center p-4 ${className}`}
        id={id}
        tabIndex={-1}
        aria-labelledby={`${id}Label`}
        aria-hidden={!show}
        role="dialog"
        onClick={handleBackdropClick}
      >
        <div className={`relative w-full max-w-[500px] max-h-[calc(100vh-32px)] mx-auto transition-transform duration-300 ${dialogClassName}`}>
          <div className={`relative flex flex-col w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-h-[calc(100vh-32px)] overflow-hidden ${show ? 'animate-modal-open' : 'animate-modal-close'} ${isStatic ? 'animate-modal-shake' : ''}`}>
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h5 className="m-0 text-lg font-semibold text-gray-900" id={`${id}Label`}>
                  {title}
                </h5>
                <button
                  type="button"
                  className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-0 leading-none transition-colors hover:text-gray-900"
                  aria-label="Close"
                  onClick={onClose}
                >
                  &times;
                </button>
              </div>
            )}
            <div className="p-5 overflow-y-auto flex-1">{children}</div>
            {modalFooter && (
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border-none rounded-lg cursor-pointer transition-colors hover:bg-gray-200"
                  onClick={onClose}
                >
                  Close
                </button>
                {saveButtonText && (
                  <button
                    disabled={isSaving}
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-primary border-none rounded-lg cursor-pointer transition-colors hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
      <div className="fixed inset-0 bg-black/50 z-[1040]" />
    </>
  );
}
