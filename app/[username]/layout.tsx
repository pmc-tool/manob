// Layout for public user profile pages
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
