// MIGRATION: Shared PageLayout with Header and Sidebar for PMC pages
'use client';

import { ReactNode } from 'react';
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header />
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <ProjectSidebar />
        </aside>

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
