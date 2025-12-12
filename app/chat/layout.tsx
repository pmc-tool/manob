// Chat layout using same shell as dashboard/marketplace
'use client';

import React from 'react';
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <header className="header">
        <Header />
      </header>

      <div className="content px-2 sm:pb-2" style={{ gridTemplateColumns: 'auto 1fr', height: '100%' }}>
        {/* Sidebar column */}
        <aside className="flex relative z-40" style={{ overflow: 'visible' }}>
          <ProjectSidebar />
        </aside>

        {/* Main content area */}
        <main className="main border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a] relative z-10" style={{ height: '100%', minHeight: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
