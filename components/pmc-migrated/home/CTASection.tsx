// CTA Section - Reusable call-to-action component
'use client';

import Link from 'next/link';
import styles from './home.module.css';

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttons?: CTAButton[];
  dark?: boolean;
}

const defaultButtons: CTAButton[] = [
  { label: 'Browse code packs', href: '/marketplace', variant: 'primary' },
  { label: 'Book a build slot', href: '/contact', variant: 'secondary' },
];

export default function CTASection({
  title = 'Launch with manob.ai',
  subtitle = 'Merge human judgment with AI speed. Buy a code pack, tailor it with us, and deploy with confidence.',
  buttons = defaultButtons,
  dark = true,
}: CTASectionProps) {
  return (
    <section className={`${styles.ctaSection} ${dark ? styles.ctaSectionDark : ''}`} id="cta">
      <div className={styles.container}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{title}</h2>
          <p className={styles.ctaSubtitle}>{subtitle}</p>
          <div className={styles.ctaButtons}>
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className={button.variant === 'primary' ? styles.ctaButtonPrimary : styles.ctaButtonSecondary}
              >
                {button.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
