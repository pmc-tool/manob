// HomePage - Main landing page component
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import HomeHeader from './HomeHeader';
import HeroSection from './HeroSection';
import CodePacksSection from './CodePacksSection';
import HowItWorksSection from './HowItWorksSection';
import ServicesSection from './ServicesSection';
import MobileAppSection from './MobileAppSection';
import ShowcaseSection from './ShowcaseSection';
import CTASection from './CTASection';
import Footer from '@/components/footer';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleSubmit = (query: string) => {
    console.log('User query:', query);
    // Navigate to chat or handle AI interaction
    router.push(`/projects?prompt=${encodeURIComponent(query)}`);
  };

  const handleTalkToHuman = () => {
    // Open chat or contact form
    router.push('/contact');
  };

  return (
    <div className="home-page min-h-screen bg-[#fafafa]">
      <HomeHeader />
      <main>
        <HeroSection
          onSubmit={handleSubmit}
          onTalkToHuman={handleTalkToHuman}
        />
        <CodePacksSection />
        {/* Show additional sections only for public (non-authenticated) users */}
        {!isAuthenticated && (
          <>
            <HowItWorksSection />
            <ServicesSection />
            <MobileAppSection />
            <ShowcaseSection />
            <CTASection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
