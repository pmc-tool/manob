// MIGRATION: MetaInfoSection component from PackMyCode
'use client';

import { ReactNode } from 'react';
import styles from './MetaInfoSection.module.css';

interface MetaInfoProps {
  children: ReactNode;
  title: string;
}

export default function MetaInfoSection({ children, title }: MetaInfoProps) {
  return (
    <div className={styles.section}>
      <h5 className={styles.title}>{title}</h5>
      {children}
    </div>
  );
}
