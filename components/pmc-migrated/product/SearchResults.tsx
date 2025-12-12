// MIGRATION: Search results from PMC
// VIPER: Visual consistency with Engine design system

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Tabs, Select, Empty, Spin, Tag } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchApi } from '@/lib/api/search';
import { ProductGrid } from './ProductGrid';
import type { Product, Service, Job, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';

const { Option } = Select;

interface SearchResultsProps {
  initialQuery?: string;
}

/**
 * Search Results Component
 * MIGRATION: Full search interface with filters and results
 */
export function SearchResults({ initialQuery = '' }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'services' | 'jobs'>(
    (searchParams.get('type') as 'all' | 'products' | 'services' | 'jobs') || 'all'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: Product[];
    services: Service[];
    jobs: Job[];
    pagination: Pagination | null;
    totalResults: number;
  }>({
    products: [],
    services: [],
    jobs: [],
    pagination: null,
    totalResults: 0,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch search results
  const performSearch = useCallback(async (searchQuery: string, type?: string, sort?: string, page = 1) => {
    if (!searchQuery.trim()) {
      setResults({ products: [], services: [], jobs: [], pagination: null, totalResults: 0 });
      return;
    }

    try {
      setLoading(true);
      const data = await searchApi.search({
        query: searchQuery,
        type: type === 'all' ? undefined : type as 'products' | 'services' | 'jobs',
        sortBy: sort as 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest',
        page,
        limit: 12,
      });

      setResults({
        products: data.products || [],
        services: data.services || [],
        jobs: data.jobs || [],
        pagination: data.pagination,
        totalResults: data.totalResults,
      });
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial search and recent searches
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      performSearch(q, activeTab, sortBy);
    }

    // Load recent searches
    searchApi.getRecentSearches().then((data) => {
      setRecentSearches(data.searches);
    }).catch(() => {});
  }, [searchParams, activeTab, sortBy, performSearch]);

  // Fetch suggestions
  const fetchSuggestions = async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await searchApi.getSuggestions(value);
      setSuggestions(data.suggestions);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) return;

    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(value)}&type=${activeTab}&sort=${sortBy}`);
    performSearch(value, activeTab, sortBy);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'products' | 'services' | 'jobs');
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${tab}&sort=${sortBy}`);
      performSearch(query, tab, sortBy);
    }
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${activeTab}&sort=${sort}`);
      performSearch(query, activeTab, sort);
    }
  };

  const handleClearRecent = async () => {
    try {
      await searchApi.clearRecentSearches();
      setRecentSearches([]);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Input.Search
          size="large"
          placeholder="Search products, services, jobs..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
            setShowSuggestions(true);
          }}
          onSearch={handleSearch}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="max-w-2xl"
          enterButton="Search"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-w-2xl rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-medium text-gray-500">
                  Suggestions
                </p>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="block w-full rounded px-2 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                  >
                    <SearchOutlined className="mr-2 text-gray-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            {recentSearches.length > 0 && (
              <div className="border-t border-gray-100 p-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-xs font-medium text-gray-500">Recent Searches</p>
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={handleClearRecent}
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((s, i) => (
                  <button
                    key={i}
                    className="block w-full rounded px-2 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setQuery(s);
                      handleSearch(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {query && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  Found <strong>{results.totalResults}</strong> results for{' '}
                  <strong>"{query}"</strong>
                </>
              )}
            </p>
            <Select value={sortBy} onChange={handleSortChange} className="w-44">
              <Option value="relevance">Relevance</Option>
              <Option value="newest">Newest First</Option>
              <Option value="price_asc">Price: Low to High</Option>
              <Option value="price_desc">Price: High to Low</Option>
              <Option value="rating">Best Rating</Option>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[
              { key: 'all', label: `All (${results.totalResults})` },
              { key: 'products', label: `Products (${results.products.length})` },
              { key: 'services', label: `Services (${results.services.length})` },
              { key: 'jobs', label: `Jobs (${results.jobs.length})` },
            ]}
          />

          {/* Results Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : results.totalResults === 0 ? (
            <Empty
              description={`No results found for "${query}"`}
              className="py-12"
            />
          ) : (
            <ProductGrid
              products={
                activeTab === 'all'
                  ? results.products
                  : activeTab === 'products'
                  ? results.products
                  : []
              }
              pagination={results.pagination || undefined}
              showSort={false}
              emptyText="No products match your search"
            />
          )}
        </>
      )}

      {/* Empty State - No Query */}
      {!query && (
        <div className="py-12 text-center">
          <SearchOutlined className="mb-4 text-6xl text-gray-300" />
          <h2 className="mb-2 text-xl font-medium text-gray-900">
            Search for products, services, or jobs
          </h2>
          <p className="text-gray-500">
            Enter a search term above to find what you're looking for
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
