// Notifications layout with Header + Sidebar
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <Header />
      </header>
      <div
        className="content px-2 sm:pb-2"
        style={{ gridTemplateColumns: 'auto 1fr' }}
      >
        <aside className="flex relative z-40" style={{ overflow: 'visible' }}>
          <ProjectSidebar />
        </aside>
        <main className="main border border-gray-200 rounded-mdxl overflow-hidden shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.1)] relative z-10 bg-white">
          <div className="p-4 md:p-6 h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
