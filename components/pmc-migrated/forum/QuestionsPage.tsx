// MIGRATION: QuestionsPage component - uses real API
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import QuestionCard from './QuestionCard';
import ForumSidebar from './ForumSidebar';
import ForumSearch from './ForumSearch';
import { forumApi } from '@/lib/api/forum';
import type { Forum, ForumContributor, ForumListParams } from '@/lib/api/types';
import styles from './forum.module.css';

// Forum tabs configuration
const forumTabs = [
  { label: 'Recent', filter: 'recent' },
  { label: 'Unanswered', filter: 'unanswered' },
  { label: 'Unsolved', filter: 'unsolved' },
  { label: 'Solved', filter: 'solved' },
  { label: 'Pinned', filter: 'pinned' },
] as const;

type TabFilter = (typeof forumTabs)[number]['filter'];

export default function QuestionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  // State
  const [forums, setForums] = useState<Forum[]>([]);
  const [topContributors, setTopContributors] = useState<ForumContributor[]>([]);
  const [topQuestions, setTopQuestions] = useState<{ id: string; title: string }[]>([]);
  const [sortOption, setSortOption] = useState<string>('DESC');
  const [tabFilter, setTabFilter] = useState<TabFilter>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyword = queryParams.get('query') || '';

  // Sync currentPage from URL
  useEffect(() => {
    const page = Number(queryParams.get('page') || 1);
    setCurrentPage(page);
  }, [queryParams]);

  // Fetch forums data
  const fetchForums = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: ForumListParams = {
        page: currentPage,
        limit: 10,
        sort_by: sortOption as ForumListParams['sort_by'],
        filter: tabFilter,
      };

      if (keyword) {
        params.term = keyword;
      }

      const response = await forumApi.getForums(params);
      setForums(response.data.items);
      setTotalPages(response.data.pagination.total_pages);
    } catch (err) {
      console.error('Failed to fetch forums:', err);
      setError('Failed to load discussions. Please try again.');
      setForums([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortOption, tabFilter, keyword]);

  // Fetch sidebar data (top contributors and top forums)
  const fetchSidebarData = useCallback(async () => {
    try {
      const [contributorsRes, topForumsRes] = await Promise.all([
        forumApi.getTopContributors(),
        forumApi.getTopForums(),
      ]);
      setTopContributors(contributorsRes.data);
      setTopQuestions(topForumsRes.data);
    } catch (err) {
      console.error('Failed to fetch sidebar data:', err);
    }
  }, []);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  // Fetch sidebar data once on mount
  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle tab change
  const handleTabChange = (filter: TabFilter) => {
    setTabFilter(filter);
    handlePageChange(1);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    handlePageChange(1);
  };

  return (
    <div className={styles.forumContainer}>
      {/* Header */}
      <div className={styles.forumHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Forum.</h1>
            <p>Ask questions and get answers from the community.</p>
            <ForumSearch placeholder="Search articles" />
          </div>
          {/* Header image - optional */}
          <div className={styles.headerImage}>
            {/* Image placeholder */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.forumContent}>
        <div className={styles.forumMain}>
          {/* Title and filter */}
          <div className={styles.discussionsHeader}>
            <h3>
              <MessageCircle className={styles.headerIcon} />
              Recent Discussions
            </h3>
            <div className={styles.filterWrapper}>
              <span className={styles.muted}>Filter By:</span>
              <select
                className={styles.filterSelect}
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="DESC">Most Recent</option>
                <option value="likes">Most Votes</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.forumTabs}>
            <ul className={styles.tabsList}>
              {forumTabs.map((tab, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={`${styles.tabItem} ${tabFilter === tab.filter ? styles.tabActive : ''}`}
                    onClick={() => handleTabChange(tab.filter)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Questions list */}
          <div className={styles.questionsList}>
            {isLoading ? (
              <div className={styles.loadingWrapper}>
                <div className={styles.loadingSpinner} />
                <p>Loading discussions...</p>
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <p>{error}</p>
                <button
                  onClick={fetchForums}
                  className={styles.retryButton}
                >
                  Try Again
                </button>
              </div>
            ) : forums.length > 0 ? (
              forums.map((forum) => (
                <QuestionCard key={forum.id} question={forum} searchTerm={keyword} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No discussions found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.forumSidebarWrapper}>
          <ForumSidebar
            topContributors={topContributors}
            topQuestions={topQuestions}
          />
        </div>
      </div>
    </div>
  );
}
