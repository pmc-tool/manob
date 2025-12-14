// Code Packs Section - Reusable template grid component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './home.module.css';

export interface CodePack {
  id: string;
  title: string;
  description: string;
  image?: string;
  gradient?: string;
  href?: string;
  category?: string;
}

interface CodePacksSectionProps {
  title?: string;
  sectionLabel?: string;
  categories?: string[];
  packs?: CodePack[];
  showBrowseAll?: boolean;
  browseAllHref?: string;
}

const defaultPacks: CodePack[] = [
  {
    id: '1',
    title: 'SaaS Core + Billing',
    description: 'Auth, subscriptions, settings, docs-ready',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    category: 'SaaS',
  },
  {
    id: '2',
    title: 'Commerce + Checkout',
    description: 'Storefront, cart, Stripe, and analytics wired',
    gradient: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
    category: 'Commerce',
  },
  {
    id: '3',
    title: 'Mobile-first Launch',
    description: 'Responsive landing, signup flows, analytics',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    category: 'Mobile',
  },
  {
    id: '4',
    title: 'AI Agent Toolkit',
    description: 'Orchestration, vector search, eval dashboards',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    category: 'AI',
  },
  {
    id: '5',
    title: 'Data App Starter',
    description: 'Admin, CRUD scaffolds, charts, auth baked in',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    category: 'Data',
  },
  {
    id: '6',
    title: 'Ops Dashboard',
    description: 'Role-based dashboards with audit trails',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    category: 'Infrastructure',
  },
  {
    id: '7',
    title: 'Founder Portfolio',
    description: 'Story-first portfolio with case studies',
    gradient: 'linear-gradient(135deg, #EAB308 0%, #F97316 100%)',
    category: 'Portfolio',
  },
  {
    id: '8',
    title: 'Financial OS',
    description: 'Ledger-ready finances with alerts and exports',
    gradient: 'linear-gradient(135deg, #64748B 0%, #374151 100%)',
    category: 'Finance',
  },
];

const defaultCategories = ['SaaS', 'Mobile', 'Commerce', 'Infrastructure'];

export default function CodePacksSection({
  title = 'Start faster with human-reviewed starters',
  sectionLabel = 'Code packs',
  categories = defaultCategories,
  packs = defaultPacks,
  showBrowseAll = true,
  browseAllHref = '/marketplace',
}: CodePacksSectionProps) {
  return (
    <section className={styles.codePacksSection} id="templates">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <p className={styles.sectionLabel}>{sectionLabel}</p>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>
          <div className={styles.categoryTabs}>
            {categories.map((category) => (
              <button key={category} className={styles.categoryTab}>
                {category}
              </button>
            ))}
            {showBrowseAll && (
              <Link href={browseAllHref} className={styles.categoryTabActive}>
                Browse all
              </Link>
            )}
          </div>
        </div>

        {/* Template Grid */}
        <div className={styles.packGrid}>
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={pack.href || `/marketplace?category=${pack.category}`}
              className={styles.packCard}
            >
              <div
                className={styles.packImage}
                style={{ background: pack.gradient || '#e5e7eb' }}
              >
                {pack.image && (
                  <Image
                    src={pack.image}
                    alt={pack.title}
                    fill
                    className={styles.packImageSrc}
                  />
                )}
              </div>
              <div className={styles.packContent}>
                <h3 className={styles.packTitle}>{pack.title}</h3>
                <p className={styles.packDescription}>{pack.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
