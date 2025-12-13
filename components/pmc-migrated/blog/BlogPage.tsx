// Blog Page Component (matching original PMC design)
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import BlogGridCard from './BlogGridCard';
import BlogHeroCard from './BlogHeroCard';
import BlogFeaturedCard from './BlogFeaturedCard';
import {
  mockBlogPosts,
  mockBlogTags,
  filterBlogsByTag,
  searchBlogs,
  BlogPost,
} from '@/lib/mocks/blog.mock';

interface BlogPageProps {
  searchQuery?: string;
  filterTag?: string;
}

export default function BlogPage({ searchQuery = '', filterTag = '' }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [activeTag, setActiveTag] = useState(filterTag);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter and search blogs
  const filteredPosts = useMemo(() => {
    let posts = mockBlogPosts;

    if (activeTag) {
      posts = filterBlogsByTag(posts, activeTag);
    }

    if (searchTerm) {
      posts = searchBlogs(posts, searchTerm);
    }

    return posts;
  }, [activeTag, searchTerm]);

  // Get hero post (first post when not searching)
  const heroPost = !searchTerm && !activeTag ? filteredPosts[0] : null;

  // Get remaining posts
  const remainingPosts = heroPost ? filteredPosts.slice(1) : filteredPosts;

  // Pagination
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

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
            <h1 className="blog-title fw-semibold text-3xl md:text-4xl leading-tight">
              Meet the minds,{' '}
              <span className="blog-text-rounded">discover</span> the ideas, and feel the energy
              fueling the PackMyCode{' '}
              <span className="blog-text-underline">community</span>.
            </h1>
          </div>
        </div>

        {/* Tags + Search Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600 fz14">Tags:</span>
            {mockBlogTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`fz13 px-3 py-2 font-medium rounded-full transition-colors ${
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
                className="text-primary fz13 font-semibold uppercase ml-2 hover:underline"
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
              className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-primary fz14"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Hero Blog Card (only when not searching/filtering) */}
        {heroPost && <BlogHeroCard post={heroPost} />}

        {/* Search Results Info */}
        {(searchTerm || activeTag) && filteredPosts.length > 0 && (
          <div className="mb-6">
            <h3 className="fz18">
              Showing{' '}
              <span className="text-primary italic underline">{filteredPosts.length}</span> results
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
        {paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post, idx) => (
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
            <h4 className="fz18 mb-2">
              Oops! We couldn't find any results for '
              <span className="text-primary">
                {searchTerm}
                {activeTag}
              </span>
              '.
            </h4>
            <p className="text-gray-500">
              Try searching with different keywords or explore our latest articles.{' '}
              <button onClick={clearFilters} className="font-semibold text-dark underline">
                View All Blogs
              </button>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
