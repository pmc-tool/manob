// Settings layout with Header + Sidebar + Tab Navigation
import Header from '@/components/header';
import ProjectSidebar from '@/components/sidebar';
import { SettingsNav } from '@/components/pmc-migrated/settings';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
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
        <main className="main border border-gray-200 rounded-xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.1)] relative z-10 bg-white">
          <div className="h-full overflow-auto">
            {/* Header Section */}
            <div className="px-4 md:px-6 pt-6 pb-0">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold text-gray-900 mb-5 text-center">Settings</h1>
                <SettingsNav />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-8 pt-8">
              <div className="max-w-2xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
