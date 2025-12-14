// Dashboard Home - Hero input + Templates section for logged-in users
'use client';

import { HeroSection, CodePacksSection } from '@/components/pmc-migrated/home';
import styles from './DashboardHome.module.css';

export default function DashboardHome() {
  const handleSubmit = (query: string) => {
    console.log('User query:', query);
    // TODO: Handle the query - send to AI, navigate to projects, etc.
  };

  const handleTalkToHuman = () => {
    // Navigate to contact or support
    window.location.href = '/support-contact';
  };

  return (
    <div className={styles.dashboardHome}>
      {/* Hero Section - Describe what you want to build */}
      <div className={styles.heroSection}>
        <HeroSection
          title="What do you want to build today?"
          subtitle="Describe your project and let manob.ai help you get started with production-ready code."
          placeholder="Describe what you want to build with manob.ai..."
          onSubmit={handleSubmit}
          onTalkToHuman={handleTalkToHuman}
          compact
        />
      </div>

      {/* Templates Section */}
      <div className={styles.templatesSection}>
        <CodePacksSection
          title="Start faster with human-reviewed starters"
          sectionLabel="Code packs"
          showBrowseAll={true}
          browseAllHref="/marketplace"
        />
      </div>
    </div>
  );
}
