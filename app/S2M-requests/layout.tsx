// S2M-requests layout - Seller Support ticket form
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';

export default function S2MRequestsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <Header />
      </header>
      <div className="content px-2 sm:pb-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <aside className="flex relative z-40" style={{ overflow: 'visible' }}>
          <ProjectSidebar />
        </aside>
        <main className="main border border-gray-200 rounded-xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.1)] relative z-10 bg-white">
          <div className="h-full overflow-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
