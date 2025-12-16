// Main page - Conditional rendering based on auth state
'use client';

import { useAuth } from '@/context/AuthContext';
import { HomePage } from '@/components/pmc-migrated/home';
import { DashboardHome } from '@/components/pmc-migrated/dashboard-home';
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Guest users see the landing page
  if (!isAuthenticated) {
    return <HomePage />;
  }

  // Logged-in users see the dashboard with Chat + Templates
  return (
    <div className="layout" style={{ overflow: 'hidden' }}>
      <header className="header">
        <Header />
      </header>

      <div className="content px-2 sm:pb-2" style={{ gridTemplateColumns: 'auto 1fr', height: '100%', overflow: 'hidden' }}>
        {/* Sidebar column */}
        <aside className="flex relative z-40" style={{ overflow: 'visible', height: '100%' }}>
          <ProjectSidebar />
        </aside>

        {/* Main content area */}
        <main className="main border border-gray-200 rounded-mdxl shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a] relative z-10" style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
