// How It Works Section - Reusable features grid component
'use client';

import {
  Code,
  Puzzle,
  Sparkles,
  MousePointer,
  LayoutGrid,
  Palette,
  LucideIcon
} from 'lucide-react';
import styles from './home.module.css';

export interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
  sectionLabel?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    id: '1',
    icon: Code,
    title: 'Buy code that ships',
    description: 'Production-grade packs curated by our engineers so you start with reliable code, not boilerplate.',
  },
  {
    id: '2',
    icon: Puzzle,
    title: 'Co-build with AI',
    description: 'Modify and extend your pack with an embedded AI pair that understands the repo structure and your goals.',
  },
  {
    id: '3',
    icon: Sparkles,
    title: 'Humans review every step',
    description: 'Our engineers audit diffs, resolve edge cases, and keep standards intact before anything hits production.',
  },
  {
    id: '4',
    icon: MousePointer,
    title: 'Deploy without fear',
    description: 'One-click deploys, runbooks, and rollback plans built by the same humans who curated the pack.',
  },
  {
    id: '5',
    icon: LayoutGrid,
    title: 'Your stack, your repo',
    description: 'Sync to your GitHub, keep ownership, and let AI suggest changes while humans keep quality high.',
  },
  {
    id: '6',
    icon: Palette,
    title: 'Governance included',
    description: 'Guardrails for secrets, migrations, and access control so AI moves fast without breaking compliance.',
  },
];

export default function HowItWorksSection({
  title = 'Human + AI, one production pipeline',
  subtitle = 'manob.ai gives you a vetted codebase, an embedded AI pair, and human engineers who review every change before you deploy.',
  sectionLabel = 'How it works',
  features = defaultFeatures,
}: HowItWorksSectionProps) {
  return (
    <section className={styles.howItWorksSection} id="features">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeaderCenter}>
          <p className={styles.sectionLabel}>{sectionLabel}</p>
          <h2 className={styles.sectionTitleLarge}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <IconComponent size={20} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
