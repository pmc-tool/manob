// Become Seller layout with Header only (no sidebar)
import Header from '@/components/header';

export default function BecomeSellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <Header />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
