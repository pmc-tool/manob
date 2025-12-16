"use client";
import { Card, Input, Pagination, Empty, Skeleton, Tag } from "antd";
import { Search, ChevronRight, ThumbsUp, Clock, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import {
  useGetBlogProblemCateQuery,
  useGetSearchBlogQuery,
} from "@/state/services/support-service/support.service";
import { calculateTimeAgo } from "@/utils/dateFormat";

// Mock data for development
const mockSearchResults = [
  {
    id: "result-001",
    slug: "how-to-download-products",
    title: "How to download your purchased products",
    short_description: "Learn how to access and download your purchased digital products from your account dashboard. This guide covers all the steps from purchase to download.",
    total_likes: 45,
    category_id: "cat-001",
    category_title: "Purchases & Downloads",
    user_meta: { first_name: "Support", last_name: "Team" },
    created_at: "2024-12-10T10:30:00Z",
  },
  {
    id: "result-002",
    slug: "payment-methods-available",
    title: "What payment methods are available?",
    short_description: "We accept various payment methods including credit cards, PayPal, and regional payment options. Find out which payment methods work best for you.",
    total_likes: 32,
    category_id: "cat-002",
    category_title: "Payments & Billing",
    user_meta: { first_name: "Billing", last_name: "Support" },
    created_at: "2024-12-08T14:20:00Z",
  },
  {
    id: "result-003",
    slug: "account-security-tips",
    title: "Account security best practices",
    short_description: "Keep your account secure with these essential tips. Learn about two-factor authentication, password management, and recognizing phishing attempts.",
    total_likes: 28,
    category_id: "cat-003",
    category_title: "Account & Settings",
    user_meta: { first_name: "Security", last_name: "Team" },
    created_at: "2024-12-05T09:15:00Z",
  },
];

const mockCategories = [
  { id: "cat-001", slug: "purchases-downloads", title: "Purchases & Downloads" },
  { id: "cat-002", slug: "payments-billing", title: "Payments & Billing" },
  { id: "cat-003", slug: "account-settings", title: "Account & Settings" },
  { id: "cat-004", slug: "getting-started", title: "Getting Started" },
];

export default function SupportSearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("query") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState(keyword);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResult, isLoading } = useGetSearchBlogQuery({
    keyword,
    page: currentPage,
    limit: 10,
  });

  const { data: categoriesData } = useGetBlogProblemCateQuery();

  const { data: suggestionResult } = useGetSearchBlogQuery({
    searchType: "SUPPORT",
    keyword: searchValue,
    limit: 5,
  });

  // Use mock data if API returns no data
  const searchResults = searchResult?.items || mockSearchResults;
  const pagination = searchResult?.pagination || { total_count: mockSearchResults.length, total_pages: 1 };
  const categories = categoriesData?.data?.items || mockCategories;
  const commonTopics = categories.slice(0, 4);
  const suggestions = suggestionResult?.items || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  const debouncedSearch = useMemo(() => debounce(handleSearchChange, 300), []);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      setShowSuggestions(false);
      if (selectedIndex >= 0) {
        router.push(`/articles/${suggestions[selectedIndex]?.slug}`);
      } else if (searchValue.trim()) {
        router.push(`/support-search-result?query=${encodeURIComponent(searchValue)}`);
      }
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <em key={index} className="bg-yellow-100 text-yellow-800 px-1 rounded not-italic font-medium">
          {part}
        </em>
      ) : (
        part
      )
    );
  };

  if (isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <Card className="mb-6">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-0">
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello, how can we help?</h2>
            <p className="text-gray-500 mb-4">Search for something, or browse by topic below.</p>

            {/* Search Box */}
            <div ref={containerRef} className="max-w-2xl mx-auto relative">
              <Input
                size="large"
                placeholder="How can we assist you today?"
                prefix={<Search size={18} className="text-gray-400" />}
                suffix={
                  <Tag className="bg-gray-100 border-0 text-gray-500 text-xs">Ctrl + K</Tag>
                }
                className="rounded-full py-3 px-5"
                defaultValue={keyword}
                onChange={debouncedSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* Search Suggestions */}
              {searchValue && showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                  <div className="border-b px-4 py-3 text-center text-sm text-gray-500">
                    Top Articles Results
                  </div>
                  {suggestions.map((item: any, index: number) => (
                    <Link
                      key={index}
                      href={`/articles/${item?.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b last:border-0 ${
                        index === selectedIndex ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Search size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-400">{item?.category_title}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
                    <Link
                      href={`/support-search-result?query=${searchValue}`}
                      className="text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                      View All Results <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Common Topics */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-gray-500">Common topics:</span>
              {commonTopics.map((topic: any, index: number) => (
                <span key={topic.id}>
                  <Link
                    href={`/topic-questions/${topic?.slug}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {topic?.title}
                  </Link>
                  {index < commonTopics.length - 1 && <span className="text-gray-400">,</span>}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Search results</h2>
          <p className="text-gray-500">
            <span className="font-semibold text-gray-900">{pagination?.total_count || 0}</span> results for "
            <span className="font-semibold text-gray-900">{keyword}</span>"
          </p>
        </div>

        {/* Results List */}
        {searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((result: any) => (
              <div key={result.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/articles/${result?.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary"
                    >
                      {highlightText(result.title, keyword)}
                    </Link>
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                      <ThumbsUp size={14} />
                      <span>{result?.total_likes || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Breadcrumbs & Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                  <Link
                    href={`/topic-questions/${result?.category_id}`}
                    className="text-primary hover:underline"
                  >
                    {result.category_title}
                  </Link>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {result?.user_meta?.first_name} {result?.user_meta?.last_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {calculateTimeAgo(result?.created_at)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 mt-3 line-clamp-2">
                  {highlightText(result?.short_description, keyword)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-2">No results found for "{keyword}"</p>
                <p className="text-sm text-gray-400">Try searching with different keywords</p>
              </div>
            }
          />
        )}

        {/* Pagination */}
        {pagination?.total_count > 0 && pagination?.total_pages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={pagination?.total_count}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}
