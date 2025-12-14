// MIGRATION: Ribbon component from manob.ai
'use client';

import { ReactNode } from 'react';
import styles from './Ribbon.module.css';

type RibbonProps = {
  label?: string;
  icon?: ReactNode;
  variant?: 'trending' | 'sale' | 'pixi';
};

export default function Ribbon({ label, icon, variant = 'sale' }: RibbonProps) {
  return (
    <span className={`${styles.ribbon} ${styles[variant]}`}>
      {label}
      {icon && <span className={styles.icon}>{icon}</span>}
    </span>
  );
}
