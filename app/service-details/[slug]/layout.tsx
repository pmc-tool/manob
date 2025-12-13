// Service Details layout with sidebar (matching PMC Engine dashboard shell)
'use client';

import React from 'react';
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

export default function ServiceDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <Header />
      </header>

      <div className="content px-2 sm:pb-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
        {/* Sidebar column - overflow visible for History panel, high z-index */}
        <aside className="flex relative z-40" style={{ overflow: 'visible' }}>
          <ProjectSidebar />
        </aside>

        {/* Main content area - lower z-index */}
        <main className="main border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a] relative z-10">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
