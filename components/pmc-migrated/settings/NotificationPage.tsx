// MIGRATION: NotificationPage component from PackMyCode
'use client';

import { useState } from 'react';
import styles from './settings.module.css';

export default function NotificationPage() {
  const [isPushActive, setIsPushActive] = useState(true);
  const [isEmailActive, setIsEmailActive] = useState(true);
  const [isMarketingActive, setIsMarketingActive] = useState(false);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
    // Mock API call - replace with actual API
    console.log('Notification setting updated');
  };

  return (
    <div className={styles.settingsCard}>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h2>Notifications</h2>
          <p className={styles.muted}>Manage your notification settings.</p>
        </div>

        <div className={styles.formSection}>
          {/* Push Notifications */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h6>Push Notifications</h6>
              <p className={styles.muted}>
                Receive push notifications for important updates.
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isPushActive}
                onChange={() => handleToggle(setIsPushActive)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Email Notifications */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h6>Email Notifications</h6>
              <p className={styles.muted}>
                Receive email notifications for account activity.
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isEmailActive}
                onChange={() => handleToggle(setIsEmailActive)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Marketing Emails */}
          <div className={`${styles.toggleRow} ${styles.noBorder}`}>
            <div className={styles.toggleLabel}>
              <h6>Marketing Emails</h6>
              <p className={styles.muted}>
                Receive promotional emails and special offers.
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isMarketingActive}
                onChange={() => handleToggle(setIsMarketingActive)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
