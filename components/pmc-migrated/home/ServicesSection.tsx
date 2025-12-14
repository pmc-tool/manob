// Services Section - Reusable services showcase component
'use client';

import { CheckCircle } from 'lucide-react';
import styles from './home.module.css';

interface ServicePoint {
  text: string;
}

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  points?: ServicePoint[];
  imageContent?: React.ReactNode;
}

const defaultPoints: ServicePoint[] = [
  { text: 'Solution architects scope and price work before AI starts typing' },
  { text: 'AI accelerates delivery; humans run reviews, tests, and cut releases' },
  { text: 'We stay post-launch to monitor, iterate, and keep the lights on' },
];

export default function ServicesSection({
  title = 'Services that stay close to your code',
  subtitle = 'manob.ai pairs you with humans who supervise AI changes, wire integrations, and own delivery. One team, one pipeline.',
  points = defaultPoints,
  imageContent,
}: ServicesSectionProps) {
  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <div className={styles.servicesGrid}>
          {/* Content Column */}
          <div className={styles.servicesContent}>
            <h2 className={styles.servicesTitle}>{title}</h2>
            <p className={styles.servicesSubtitle}>{subtitle}</p>
            <ul className={styles.servicesList}>
              {points.map((point, index) => (
                <li key={index} className={styles.servicesListItem}>
                  <CheckCircle size={20} className={styles.checkIcon} />
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder */}
          <div className={styles.servicesVisual}>
            {imageContent || (
              <div className={styles.placeholderBox}>
                <div className={styles.placeholderContent}>
                  <span className={styles.placeholderText}>Service Visual</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
