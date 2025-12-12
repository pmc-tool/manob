// MIGRATION: ProfileAboutSection component from PackMyCode
'use client';

import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/pmc-migrated/shared/modal';
import styles from './ProfileAboutSection.module.css';

interface ProfileAboutSectionProps {
  title: string;
  initialText: string;
  wordLimit?: number;
  tooltipTitle?: string;
  modifyButton?: boolean;
  onSave?: (text: string) => void;
}

export default function ProfileAboutSection({
  title,
  initialText,
  wordLimit = 100,
  tooltipTitle = 'Edit',
  modifyButton = true,
  onSave,
}: ProfileAboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aboutText, setAboutText] = useState(initialText);

  useEffect(() => {
    setAboutText(initialText);
  }, [initialText]);

  const words = initialText?.split(' ') || [];
  const visibleText = words.slice(0, wordLimit).join(' ');
  const remainingText = words.slice(wordLimit).join(' ');

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSave = () => {
    onSave?.(aboutText);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.header}>
          <h5 className={styles.title}>{title}</h5>
          {modifyButton && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setShowModal(true)}
              title={tooltipTitle}
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
        <div className={styles.content}>
          {initialText ? (
            <>
              {visibleText}
              {!isExpanded && words.length > wordLimit && (
                <>
                  ...{' '}
                  <span onClick={toggleReadMore} className={styles.readMore}>
                    Read More
                  </span>
                </>
              )}
              {isExpanded && (
                <>
                  {remainingText}{' '}
                  <span onClick={toggleReadMore} className={styles.readMore}>
                    Read Less
                  </span>
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyText}>No information available</span>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="aboutModal"
        title="About Me"
        saveButtonText="Save changes"
        onSave={handleSave}
        show={showModal}
        onClose={() => setShowModal(false)}
        backdropStatic={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>About Me</label>
          <textarea
            className={styles.textarea}
            placeholder="Write something about yourself..."
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={6}
          />
          <p className={styles.hint}>
            {aboutText.length}/600 characters (minimum 50)
          </p>
        </div>
      </Modal>
    </>
  );
}
