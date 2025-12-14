// Mobile App Section - Reusable app download component
'use client';

import Link from 'next/link';
import styles from './home.module.css';

interface MobileAppSectionProps {
  title?: string;
  subtitle?: string;
  iosLink?: string;
  androidLink?: string;
  showAndroid?: boolean;
}

export default function MobileAppSection({
  title = 'Build with AI anywhere',
  subtitle = 'Keep shipping with manob.ai on the go. Draft features, review AI suggestions, and ship mobile-first sites right from your phone.',
  iosLink = '#',
  androidLink = '#',
  showAndroid = false,
}: MobileAppSectionProps) {
  return (
    <section className={styles.mobileAppSection}>
      <div className={styles.container}>
        <div className={styles.mobileAppGrid}>
          {/* Placeholder */}
          <div className={styles.mobileAppVisual}>
            <div className={styles.placeholderBox}>
              <div className={styles.placeholderContent}>
                <span className={styles.placeholderText}>Mobile App Preview</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.mobileAppContent}>
            <h2 className={styles.mobileAppTitle}>{title}</h2>
            <p className={styles.mobileAppSubtitle}>{subtitle}</p>
            <div className={styles.appButtons}>
              <Link href={iosLink} className={styles.appStoreButton}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Download on iOS</span>
              </Link>
              {showAndroid && (
                <Link href={androidLink} className={styles.appStoreButton}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341l2.204 3.816-.002.001a.501.501 0 01-.183.683.501.501 0 01-.683-.183l-2.231-3.865c-1.376.613-2.92.963-4.558.963-1.636 0-3.179-.35-4.555-.963L5.28 19.66a.499.499 0 01-.682.182.5.5 0 01-.183-.683l2.204-3.818C3.755 13.607 2 10.67 2 7.333h20c0 3.337-1.755 6.274-4.477 8.008zM7 10.333a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/>
                  </svg>
                  <span>Get on Android</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
