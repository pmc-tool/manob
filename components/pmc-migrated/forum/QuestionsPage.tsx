// MIGRATION: QuestionsPage component from manob.ai
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import QuestionCard from './QuestionCard';
import ForumSidebar from './ForumSidebar';
import ForumSearch from './ForumSearch';
import {
  mockForumQuestions,
  mockTopContributors,
  mockTopQuestions,
  forumTabs,
  filterQuestions,
  sortQuestions,
} from '@/lib/mocks/forum.mock';
import styles from './forum.module.css';

export default function QuestionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();
  const [sortOption, setSortOption] = useState<string>('DESC');
  const [tabFilter, setTabFilter] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const keyword = queryParams.get('query') || '';

  // Sync currentPage from URL
  useEffect(() => {
    const page = Number(queryParams.get('page') || 1);
    setCurrentPage(page);
  }, [queryParams]);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [tabFilter, sortOption, keyword]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let questions = filterQuestions(mockForumQuestions, tabFilter, keyword);
    questions = sortQuestions(questions, sortOption);
    return questions;
  }, [tabFilter, sortOption, keyword]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle tab change
  const handleTabChange = (filter: string) => {
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
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} searchTerm={keyword} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No discussions found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.forumSidebarWrapper}>
          <ForumSidebar
            topContributors={mockTopContributors}
            topQuestions={mockTopQuestions}
          />
        </div>
      </div>
    </div>
  );
}
