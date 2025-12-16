"use client";
import { Card, Input, Collapse, Tag, Button, Skeleton } from "antd";
import { Search, HelpCircle, MessageCircle, ChevronRight, ArrowUpRight, BookOpen, CreditCard, Shield, Settings, Users, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useGetBlogProblemCateQuery, useGetSearchBlogQuery } from "@/state/services/support-service/support.service";

// Mock data for development
const mockProblemCategories = [
  {
    id: "cat-001",
    slug: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of using PackMyCode marketplace and get up to speed quickly.",
    blog_count: 12,
    image: "icons/getting-started.svg",
    type: "SUPPORT",
  },
  {
    id: "cat-002",
    slug: "account-settings",
    title: "Account & Settings",
    description: "Manage your profile, security settings, and account preferences.",
    blog_count: 8,
    image: "icons/account.svg",
    type: "SUPPORT",
  },
  {
    id: "cat-003",
    slug: "payments-billing",
    title: "Payments & Billing",
    description: "Information about payment methods, invoices, and billing inquiries.",
    blog_count: 15,
    image: "icons/payment.svg",
    type: "SUPPORT",
  },
  {
    id: "cat-004",
    slug: "purchases-downloads",
    title: "Purchases & Downloads",
    description: "Help with downloading products, managing licenses, and purchase history.",
    blog_count: 10,
    image: "icons/download.svg",
    type: "SUPPORT",
  },
  {
    id: "cat-005",
    slug: "seller-guide",
    title: "Seller Guide",
    description: "Everything you need to know about selling on PackMyCode marketplace.",
    blog_count: 20,
    image: "icons/seller.svg",
    type: "SUPPORT",
  },
  {
    id: "cat-006",
    slug: "refunds-disputes",
    title: "Refunds & Disputes",
    description: "Learn about our refund policy and how to resolve purchase disputes.",
    blog_count: 6,
    image: "icons/refund.svg",
    type: "SUPPORT",
  },
];

const mockFaqs = [
  {
    key: "1",
    label: "How do I create an account on PackMyCode?",
    children: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, fill in your details including email and password, then verify your email address. Once verified, you can start browsing and purchasing products.",
  },
  {
    key: "2",
    label: "What payment methods do you accept?",
    children: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your region. All transactions are secured with industry-standard encryption.",
  },
  {
    key: "3",
    label: "How do I download my purchased products?",
    children: "After completing your purchase, go to 'My Purchases' in your account dashboard. Click on the product you want to download and select 'Download'. You can download your purchases anytime from your account.",
  },
  {
    key: "4",
    label: "What is included in the product license?",
    children: "Each product comes with a license that specifies usage rights. Regular licenses are for single projects, while Extended licenses allow for broader use including resale. Check the specific license terms on each product page.",
  },
  {
    key: "5",
    label: "How can I request a refund?",
    children: "If you're not satisfied with a purchase, you can request a refund within 14 days. Go to 'My Purchases', select the item, and click 'Request Refund'. Our team will review your request and respond within 2-3 business days.",
  },
  {
    key: "6",
    label: "How do I contact seller support?",
    children: "You can contact sellers directly through the product page by clicking 'Contact Seller'. For general support, visit our Support Center or create a support ticket from your account dashboard.",
  },
  {
    key: "7",
    label: "Can I become a seller on PackMyCode?",
    children: "Yes! Anyone can apply to become a seller. Click 'Become a Seller' in the navigation menu, complete your profile, submit your application with sample work, and our team will review it within 5-7 business days.",
  },
];

const getCategoryIcon = (slug: string) => {
  const icons: Record<string, React.ReactNode> = {
    "getting-started": <BookOpen size={24} />,
    "account-settings": <Settings size={24} />,
    "payments-billing": <CreditCard size={24} />,
    "purchases-downloads": <Package size={24} />,
    "seller-guide": <Users size={24} />,
    "refunds-disputes": <Shield size={24} />,
  };
  return icons[slug] || <HelpCircle size={24} />;
};

export default function HelpPage() {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: apiCategories, isLoading } = useGetBlogProblemCateQuery();
  const { data: searchResult } = useGetSearchBlogQuery({
    searchType: "SUPPORT",
    keyword: searchValue,
    limit: 5,
  });

  // Use mock data if API returns no data
  const categories = apiCategories?.data?.items || mockProblemCategories;
  const commonTopics = categories.slice(0, 4);
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
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Skeleton active paragraph={{ rows: 6 }} />
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
        {/* Hero Search Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-0">
          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Hello, how can we
              </h1>
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-sm font-medium">P</div>
                <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-sm font-medium">M</div>
                <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-medium">C</div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">help?</h1>
            </div>
            <p className="text-gray-500 mb-6">Search for something, or browse by topic below.</p>

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
                onChange={debouncedSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* Search Suggestions */}
              {searchValue && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                  {suggestions.length > 0 && (
                    <div className="border-b px-4 py-3 text-center text-sm text-gray-500">
                      Top Articles Results
                    </div>
                  )}
                  {suggestions.length > 0 ? (
                    <>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Topic Cards */}
          <div className="lg:col-span-3 space-y-4">
            {categories.map((topic: any) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => router.push(`/topic-questions/${topic.slug}?type=${topic.type}`)}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {topic.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${topic.image}`}
                        alt={topic.title}
                        width={28}
                        height={28}
                        unoptimized
                      />
                    ) : (
                      getCategoryIcon(topic.slug)
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-2 mb-2">{topic.description}</p>
                    <Link
                      href={`/topic-questions/${topic.slug}`}
                      className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      See all {topic.blog_count} articles <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:order-first">
            <div className="sticky top-4">
              <Card className="mb-4">
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

        {/* FAQ Section */}
        <div className="mt-12 bg-gray-50 -mx-4 px-4 py-12 sm:-mx-8 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Tag color="blue" className="mb-2">FAQs</Tag>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500">Need help with something? Here are our most frequently asked questions.</p>
            </div>
            <Collapse
              items={mockFaqs}
              bordered={false}
              expandIconPosition="end"
              className="bg-white rounded-xl"
            />
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
