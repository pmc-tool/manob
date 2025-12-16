// MIGRATION: SearchSuggestions modal from manob.ai
// Simplified version with Tailwind CSS
'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockSearchSuggestions } from '@/lib/mocks/products.mock';

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
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex justify-center pt-[100px]" onClick={onClose}>
      <div
        className="relative w-full max-w-[960px] max-h-[calc(100vh-150px)] mx-4 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-gray-500 p-1 rounded transition-colors hover:text-gray-900"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="relative z-[2]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            maxLength={50}
            className="w-full py-3 pr-[140px] pl-10 text-[15px] border border-gray-300 rounded-3xl bg-white outline-none transition-colors shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_1px_2px_rgba(0,0,0,0.05)] hover:border-gray-800 focus:border-gray-800"
            placeholder="Search what are you looking for?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyUp}
          />

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <button
              className="bg-transparent border-none border-l border-gray-300 px-3 text-[13px] font-medium cursor-pointer text-gray-900"
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              {searchType}
            </button>
            {showTypeDropdown && (
              <ul className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg list-none py-2 min-w-[200px]">
                <li>
                  <button
                    className={`flex flex-col w-full px-4 py-2 border-none bg-transparent cursor-pointer text-left transition-colors hover:bg-gray-100 ${searchType === 'Products' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      setSearchType('Products');
                      setShowTypeDropdown(false);
                    }}
                  >
                    <span className="text-sm font-semibold text-gray-900">Products</span>
                    <span className="text-xs text-gray-500">Find the best products</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`flex flex-col w-full px-4 py-2 border-none bg-transparent cursor-pointer text-left transition-colors hover:bg-gray-100 ${searchType === 'Services' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      setSearchType('Services');
                      setShowTypeDropdown(false);
                    }}
                  >
                    <span className="text-sm font-semibold text-gray-900">Services</span>
                    <span className="text-xs text-gray-500">Hire professionals and agencies</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent</div>
                  <ul className="list-none p-0 m-0">
                    {recentSearches.map((item, index) => (
                      <li key={index} className="flex items-center gap-2.5 px-4 py-2 text-[15px] text-gray-900 cursor-pointer rounded-lg transition-all hover:text-primary hover:bg-gray-200">
                        <Search size={14} />
                        <span className="flex-1" onClick={() => handleSearch(item)}>{item}</span>
                        <button
                          className="bg-transparent border-none cursor-pointer text-gray-500 p-0.5 ml-auto"
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
                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top Searches</div>
                  <ul className="list-none p-0 m-0">
                    {suggestions.top_searches.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2.5 px-4 py-2 text-[15px] text-gray-900 cursor-pointer rounded-lg transition-all hover:text-primary hover:bg-gray-200"
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
              <div className="md:border-l md:border-gray-200 md:pl-6">
                {suggestions.products.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Products</span>
                      <Link href="/product-list" className="text-xs font-semibold text-primary uppercase no-underline">
                        See All
                      </Link>
                    </div>
                    {suggestions.products.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product-details/${item.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg no-underline text-gray-900 transition-colors hover:bg-gray-100 mb-2"
                        onClick={onClose}
                      >
                        <div className="w-[60px] h-[45px] rounded-md overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                        </div>
                        <span className="text-sm leading-snug line-clamp-2">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Trending</div>
            <div className="flex flex-wrap gap-1.5">
              {trendingTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-5 py-1.5 text-[13px] font-medium bg-white text-primary border border-gray-300 rounded-full cursor-pointer transition-all shadow-[inset_0_1px_0_hsla(0,0%,100%,0.2),0_1px_2px_rgba(0,0,0,0.05)] hover:border-primary hover:bg-red-50"
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
