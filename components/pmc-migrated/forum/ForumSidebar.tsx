// MIGRATION: ForumSidebar component from manob.ai
'use client';

import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';
import { Avatar } from '../shared/avatar';
import type { ForumContributor } from '@/lib/api/types';
import styles from './forum.module.css';

interface Stat {
  label: string;
  value: string;
}

interface TopQuestion {
  id: string;
  title: string;
}

interface ForumSidebarProps {
  stats?: Stat[];
  topContributors?: ForumContributor[];
  topQuestions?: TopQuestion[];
  isLoggedIn?: boolean;
}

function StatsCard({ stats }: { stats: Stat[] }) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div className={styles.statItem} key={index}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopContributors({ contributors }: { contributors: ForumContributor[] }) {
  return (
    <div className={styles.topContributors}>
      <div className={styles.sidebarSectionHeader}>
        <h5>Top Contributors</h5>
        <div className={styles.headerLine} />
      </div>
      <div className={styles.contributorsGrid}>
        {contributors?.map((contributor, index) => (
          <div className={styles.contributorItem} key={index}>
            <Avatar
              avatar={contributor.profile_image}
              username={`${contributor.first_name} ${contributor.last_name}`}
              size={42}
            />
            <div className={styles.contributorInfo}>
              <h6>{contributor.first_name} {contributor.last_name}</h6>
              <span className={styles.muted}>{contributor.total_contributed} posts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForumSidebar({
  stats,
  topContributors,
  topQuestions,
  isLoggedIn = true,
}: ForumSidebarProps) {
  return (
    <div className={styles.forumSidebar}>
      {/* Ask Question Button */}
      <div className={styles.askButtonWrapper}>
        <Link href="/forum/ask" className={styles.askButton}>
          <Plus size={21} /> Ask a Question
        </Link>
        {stats && stats.length > 0 && <StatsCard stats={stats} />}
      </div>

      {/* Top Contributors */}
      {topContributors && topContributors.length > 0 && (
        <TopContributors contributors={topContributors} />
      )}

      {/* Top Voted Questions */}
      {topQuestions && topQuestions.length > 0 && (
        <div className={styles.topQuestions}>
          <div className={styles.sidebarSectionHeader}>
            <h5>Top Voted Questions</h5>
            <div className={styles.headerLine} />
          </div>
          <div className={styles.questionLinks}>
            {topQuestions.map((question, index) => (
              <Link
                key={index}
                href={`/forum/question/${question.id}`}
                className={styles.questionLink}
              >
                <ChevronRight size={12} />
                <span>{question.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
