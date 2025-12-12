// MIGRATION: ForumSearch component from PackMyCode
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { mockForumQuestions } from '@/lib/mocks/forum.mock';
import styles from './forum.module.css';

// Simple debounce function
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T & { cancel: () => void };
  debouncedFn.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
  return debouncedFn;
}

interface ForumSearchProps {
  placeholder?: string;
}

export default function ForumSearch({ placeholder = 'Search discussions...' }: ForumSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParam = useSearchParams();
  const prevKeyword = searchParam.get('query') || '';

  // Filter questions based on search
  const suggestions = useMemo(() => {
    if (!inputValue) return [];
    const term = inputValue.toLowerCase();
    return mockForumQuestions
      .filter(
        (q) =>
          q.title.toLowerCase().includes(term) || q.body.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }, [inputValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setInputValue(keyword);
    setSelectedIndex(-1);
    setShowSuggestions(true);
    if (!keyword) {
      router.push('/forum/questions');
    }
  }, [router]);

  const debouncedChange = useMemo(() => debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    setInputValue(prevKeyword);
  }, [prevKeyword]);

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      setShowSuggestions(false);
      if (selectedIndex >= 0) {
        router.push(`/forum/question/${suggestions[selectedIndex].id}`);
      } else if (inputValue.trim()) {
        router.push(`/forum/questions?query=${encodeURIComponent(inputValue)}`);
      }
    }
  };

  // Ctrl+K shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<span class="${styles.highlight}">$1</span>`);
  };

  return (
    <div ref={containerRef} className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          className={styles.searchInput}
          placeholder={placeholder}
          defaultValue={inputValue}
          onChange={debouncedChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
        />
        <span className={styles.shortcutKey}>Ctrl + K</span>
      </div>

      {/* Suggestions dropdown */}
      {inputValue && showSuggestions && (
        <div className={styles.suggestionsDropdown}>
          {suggestions.length > 0 && (
            <div className={styles.suggestionsHeader}>Post Results</div>
          )}

          {suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <Link
                  key={suggestion.id}
                  href={`/forum/question/${suggestion.id}`}
                  className={`${styles.suggestionItem} ${
                    index === selectedIndex ? styles.suggestionActive : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.suggestionIcon}>
                    <Search size={12} />
                  </div>
                  <div className={styles.suggestionContent}>
                    <div
                      className={styles.suggestionTitle}
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(suggestion.title, inputValue),
                      }}
                    />
                  </div>
                </Link>
              ))}
              <div className={styles.suggestionsFooter}>
                <Link
                  href={`/forum/questions?query=${inputValue}`}
                  className={styles.viewAllLink}
                >
                  View All Results <ChevronRight size={14} />
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsText}>
                No results for "<span>{inputValue}</span>"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
