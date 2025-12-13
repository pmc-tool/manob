"use client";

import Header from "@/components/header";
import ProjectSidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="layout">
      <header className="header">
        <Header />
      </header>

      <div className="content px-2 sm:pb-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
        {/* Sidebar column */}
        <aside className="flex relative z-40" style={{ overflow: 'visible' }}>
          <ProjectSidebar />
        </aside>

        {/* Main content area */}
        <main className="main border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a] relative z-10">
          <div className="h-full overflow-auto p-6">
            <div className="mx-auto flex w-full max-w-[1264px] flex-1 flex-col gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                Recently Edited
              </h3>

              <div className="grid grid-cols-1 justify-center gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div className="shadow-base bg-gray-100 relative aspect-video w-full overflow-hidden rounded-lg text-sm">
                  <img
                    src="/images/01.webp"
                    alt="Sample 1"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="shadow-base bg-gray-100 relative aspect-video w-full overflow-hidden rounded-lg text-sm">
                  <img
                    src="/images/01.webp"
                    alt="Sample 2"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="shadow-base bg-gray-100 relative aspect-video w-full overflow-hidden rounded-lg text-sm">
                  <img
                    src="/images/01.webp"
                    alt="Sample 3"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="shadow-base bg-gray-100 relative aspect-video w-full overflow-hidden rounded-lg text-sm">
                  <img
                    src="/images/01.webp"
                    alt="Sample 4"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
