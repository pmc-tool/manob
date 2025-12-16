// Blog Page Component (matching original PMC design)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import BlogGridCard from './BlogGridCard';
import BlogHeroCard from './BlogHeroCard';
import BlogFeaturedCard from './BlogFeaturedCard';
import {
  fetchBlogPosts,
  fetchBlogTags,
  BlogPost,
  BlogPagination,
} from '@/lib/api/blog';

interface BlogPageProps {
  searchQuery?: string;
  filterTag?: string;
}

export default function BlogPage({ searchQuery = '', filterTag = '' }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [activeTag, setActiveTag] = useState(filterTag);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [pagination, setPagination] = useState<BlogPagination>({
    total_count: 0,
    total_pages: 1,
    current_page: 1,
    per_page: postsPerPage,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog posts from API
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchBlogPosts({
        page: currentPage,
        limit: postsPerPage,
        tag: activeTag || undefined,
        search: searchTerm || undefined,
      });

      setPosts(response.posts);
      setPagination(response.pagination);

      // Load tags if not already loaded
      if (tags.length === 0 && response.tags.length > 0) {
        setTags(response.tags);
      } else if (tags.length === 0) {
        const fetchedTags = await fetchBlogTags();
        setTags(fetchedTags);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTag, searchTerm, tags.length]);

  // Load posts on mount and when filters change
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Get hero post (first post when not searching)
  const heroPost = !searchTerm && !activeTag && posts.length > 0 ? posts[0] : null;

  // Get remaining posts
  const remainingPosts = heroPost ? posts.slice(1) : posts;

  const totalPages = pagination.total_pages;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveTag('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="mb-8 mt-4">
          <div className="max-w-3xl">
            <h1 className="blog-title font-semibold text-3xl md:text-4xl leading-tight">
              Meet the minds,{' '}
              <span className="blog-text-rounded">discover</span> the ideas, and feel the energy
              fueling the manob.ai{' '}
              <span className="blog-text-underline">community</span>.
            </h1>
          </div>
        </div>

        {/* Tags + Search Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600 text-sm">Tags:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`text-[13px] px-3 py-2 font-medium rounded-full transition-colors ${
                  activeTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {(activeTag || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-primary text-[13px] font-semibold uppercase ml-2 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles"
              className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading articles...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Hero Blog Card (only when not searching/filtering) */}
            {heroPost && <BlogHeroCard post={heroPost} />}

            {/* Search Results Info */}
            {(searchTerm || activeTag) && posts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg">
                  Showing{' '}
                  <span className="text-primary italic underline">{pagination.total_count}</span> results
                  {searchTerm && (
                    <>
                      {' '}
                      for '<span className="text-primary italic underline">{searchTerm}</span>'
                    </>
                  )}
                  {activeTag && (
                    <>
                      {' '}
                      in <span className="text-primary italic underline">{activeTag}</span>
                    </>
                  )}
                </h3>
              </div>
            )}

            {/* Blog Grid */}
            {remainingPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingPosts.map((post, idx) => (
                  <div key={post.id}>
                    {idx === 1 && !searchTerm && !activeTag ? (
                      <BlogFeaturedCard post={post} />
                    ) : (
                      <BlogGridCard post={post} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg mb-2">
                  {searchTerm || activeTag ? (
                    <>
                      Oops! We couldn't find any results for '
                      <span className="text-primary">
                        {searchTerm || activeTag}
                      </span>
                      '.
                    </>
                  ) : (
                    'No blog posts available yet.'
                  )}
                </h4>
                <p className="text-gray-500">
                  {searchTerm || activeTag ? (
                    <>
                      Try searching with different keywords or explore our latest articles.{' '}
                      <button onClick={clearFilters} className="font-semibold text-gray-900 underline">
                        View All Blogs
                      </button>
                    </>
                  ) : (
                    'Check back soon for new content!'
                  )}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-primary text-white border-primary'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 && <span className="px-2 py-2">...</span>}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
