// MIGRATION: Shared PageLayout with Header and Sidebar for PMC pages - converted to Tailwind CSS
'use client';

import { ReactNode } from 'react';
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f8]">
      <header className="sticky top-0 z-[100] h-[50px] px-3 flex items-center bg-white border-b border-gray-200">
        <Header />
      </header>

      <div className="flex flex-1 p-2 pt-0 gap-2">
        <aside className="sticky top-[58px] h-[calc(100vh-66px)] shrink-0 hidden sm:block">
          <ProjectSidebar />
        </aside>

        <main className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)]">
          {children}
        </main>
      </div>
    </div>
  );
}
