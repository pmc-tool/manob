"use client";
import { Card, Input, Button, Skeleton, Tag } from "antd";
import { Search, ChevronLeft, ChevronRight, MessageCircle, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import { useGetAllBlogsByCategoriesMinimalQuery } from "@/state/services/blog/blog.service";
import { useGetSearchBlogQuery } from "@/state/services/support-service/support.service";

// Mock data for development
const mockBlogCategory = {
  id: "cat-001",
  title: "Getting Started",
  description: "Learn the basics of using PackMyCode marketplace and get up to speed quickly with our comprehensive guides.",
  slug: "getting-started",
};

const mockArticles = [
  {
    id: "art-001",
    slug: "how-to-create-account",
    title: "How to create an account on PackMyCode",
  },
  {
    id: "art-002",
    slug: "navigating-the-marketplace",
    title: "Navigating the marketplace: A beginner's guide",
  },
  {
    id: "art-003",
    slug: "making-your-first-purchase",
    title: "Making your first purchase",
  },
  {
    id: "art-004",
    slug: "understanding-licenses",
    title: "Understanding product licenses",
  },
  {
    id: "art-005",
    slug: "downloading-purchased-items",
    title: "How to download your purchased items",
  },
  {
    id: "art-006",
    slug: "setting-up-profile",
    title: "Setting up your profile for success",
  },
  {
    id: "art-007",
    slug: "contacting-support",
    title: "How to contact support",
  },
  {
    id: "art-008",
    slug: "payment-methods-guide",
    title: "Payment methods: A complete guide",
  },
];

export default function TopicQuestionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const type = searchParams.get("type");

  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: blogCate, isLoading } = useGetAllBlogsByCategoriesMinimalQuery(id);
  const { data: searchResult } = useGetSearchBlogQuery({
    searchType: "SUPPORT",
    keyword: searchValue,
    limit: 5,
  });

  // Use mock data if API returns no data
  const articles = blogCate?.items || mockArticles;
  const category = blogCate?.category || mockBlogCategory;
  const suggestions = searchResult?.items || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  const debouncedSearch = useMemo(() => debounce(handleSearchChange, 300), []);

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

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-100 text-yellow-800 px-0.5 rounded">
          {part}
        </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
            <div>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search for help</h2>
            <p className="text-gray-500 mb-4">Find answers to your questions</p>

            {/* Search Box */}
            <div ref={containerRef} className="max-w-xl mx-auto relative">
              <Input
                size="large"
                placeholder="How can we assist you today?"
                prefix={<Search size={18} className="text-gray-400" />}
                suffix={
                  <Tag className="bg-gray-100 border-0 text-gray-500 text-xs">Ctrl + K</Tag>
                }
                className="rounded-full py-3 px-5"
                onChange={debouncedSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* Search Suggestions */}
              {searchValue && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                  {suggestions.length > 0 ? (
                    <>
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
                            <div className="font-medium text-gray-900">
                              {highlightMatch(item.title, searchValue)}
                            </div>
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
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <Search size={36} className="text-gray-300 mx-auto mb-3" />
                      <div className="text-primary font-medium">
                        No results for "<span className="font-semibold">{searchValue}</span>"
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Articles List */}
          <div className="lg:col-span-3 lg:pl-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/help"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                <ChevronLeft size={18} /> Back
              </Link>
            </div>

            {/* Category Info */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{category.title}</h1>
              <p className="text-gray-500">{category.description}</p>
            </div>

            {/* Articles */}
            <div className="space-y-3">
              {articles.length > 0 ? (
                articles.map((article: any) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article?.slug || article.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-primary flex-shrink-0" />
                    <span className="text-gray-700 group-hover:text-primary font-medium">
                      {article.title}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <HelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500">There are no articles in this category yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:order-first">
            <div className="sticky top-4">
              <Card>
                <Image
                  src="/images/support.svg"
                  alt="Support"
                  width={60}
                  height={60}
                  className="mb-4"
                  unoptimized
                />
                <h4 className="font-semibold text-gray-900 mb-2">Need more help?</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Get expert assistance and quick solutions to your questions.
                </p>
                <Link href="/support-contact">
                  <Button type="primary" icon={<MessageCircle size={16} />} className="w-full">
                    Create Support
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-primary rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Can't find the answer you're looking for?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Need help? <span className="font-semibold underline">Open a ticket</span> to get expert assistance and quick solutions to your questions with reliable support.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/support-contact">
                  <Button size="large" className="bg-white text-primary font-semibold hover:bg-gray-100">
                    Open a ticket
                  </Button>
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-4">
                * Available exclusively for Pro users with an active license.
              </p>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/open-ticket.webp"
                alt="Open Ticket"
                width={400}
                height={300}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
