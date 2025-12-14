// MIGRATION: SearchSuggestions modal from manob.ai
// Simplified version with CSS Modules
'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockSearchSuggestions } from '@/lib/mocks/products.mock';
import styles from './SearchModal.module.css';

interface SearchModalProps {
  onClose: () => void;
}

const trendingTags = [
  'Shopify',
  'WordPress',
  'UI Templates',
  'Video & Animation',
  'Programming & Tech',
  'Business',
  'Trending',
  'Music & Audio',
];

export function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchType, setSearchType] = useState<'Products' | 'Services'>('Products');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('R_SRC') || '[]');
    }
    return [];
  });

  // MOCK: Using mock data - will be replaced with real API
  const suggestions = mockSearchSuggestions;

  useEffect(() => {
    inputRef.current?.focus();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Add to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('R_SRC', JSON.stringify(updated));
    }

    router.push(`/search-result/${searchType.toLowerCase()}?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  const removeRecentSearch = (item: string) => {
    const updated = recentSearches.filter((s) => s !== item);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('R_SRC', JSON.stringify(updated));
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.searchHeader}>
          <Search size={16} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            maxLength={50}
            className={styles.searchInput}
            placeholder="Search what are you looking for?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyUp}
          />

          <div className={styles.typeDropdown}>
            <button
              className={styles.typeButton}
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              {searchType}
            </button>
            {showTypeDropdown && (
              <ul className={styles.typeMenu}>
                <li>
                  <button
                    className={`${styles.typeMenuItem} ${searchType === 'Products' ? styles.active : ''}`}
                    onClick={() => {
                      setSearchType('Products');
                      setShowTypeDropdown(false);
                    }}
                  >
                    <span className={styles.typeTitle}>Products</span>
                    <span className={styles.typeDescription}>Find the best products</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.typeMenuItem} ${searchType === 'Services' ? styles.active : ''}`}
                    onClick={() => {
                      setSearchType('Services');
                      setShowTypeDropdown(false);
                    }}
                  >
                    <span className={styles.typeTitle}>Services</span>
                    <span className={styles.typeDescription}>Hire professionals and agencies</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.columns}>
            <div className={styles.leftColumn}>
              {recentSearches.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Recent</div>
                  <ul className={styles.list}>
                    {recentSearches.map((item, index) => (
                      <li key={index} className={styles.listItem}>
                        <Search size={14} />
                        <span onClick={() => handleSearch(item)}>{item}</span>
                        <button
                          className={styles.removeButton}
                          onClick={() => removeRecentSearch(item)}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.top_searches.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Top Searches</div>
                  <ul className={styles.list}>
                    {suggestions.top_searches.map((item, index) => (
                      <li
                        key={index}
                        className={styles.listItem}
                        onClick={() => handleSearch(item)}
                      >
                        <Search size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {(suggestions.products.length > 0 || suggestions.services.length > 0) && (
              <div className={styles.rightColumn}>
                {suggestions.products.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>Products</span>
                      <Link href="/product-list" className={styles.seeAll}>
                        See All
                      </Link>
                    </div>
                    {suggestions.products.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product-details/${item.slug}`}
                        className={styles.productCard}
                        onClick={onClose}
                      >
                        <div className={styles.productImage}>
                          <div className={styles.imagePlaceholder} />
                        </div>
                        <span className={styles.productTitle}>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Trending</div>
            <div className={styles.tags}>
              {trendingTags.map((tag, index) => (
                <span
                  key={index}
                  className={styles.tag}
                  onClick={() => handleSearch(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
