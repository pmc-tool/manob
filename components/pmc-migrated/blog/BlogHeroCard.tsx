// Blog Hero Card Component (matching original PMC BlogStretchedVerticalCard)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, formatBlogDate } from '@/lib/api/blog';

interface BlogHeroCardProps {
  post: BlogPost;
}

export default function BlogHeroCard({ post }: BlogHeroCardProps) {
  return (
    <div className="blog-hero-card bg-white rounded-lg shadow mb-5 border-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Image Section */}
        <div className="lg:col-span-8 relative">
          <div className="blog-hero-image relative overflow-hidden">
            <Link href={`/blog/${post.slug || post.id}`}>
              <Image
                src={post.cover_image}
                alt={post.title}
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
                unoptimized
              />
            </Link>
            {/* Vertical Wave Shape - Desktop */}
            <div className="blog-hero-shape-vertical hidden lg:block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100.1 1920" height="100%">
                <path fill="#fff" d="M0,1920c0,0,93.4-934.4,0-1920h100.1v1920H0z" />
              </svg>
            </div>
            {/* Horizontal Wave Shape - Mobile */}
            <div className="blog-hero-shape-horizontal lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 100.1" className="w-full">
                <path fill="#fff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="p-6 flex flex-col h-full">
            <h3 className="blog-card-title font-semibold text-[22px] mb-4">
              <Link href={`/blog/${post.slug || post.id}`} className="text-gray-900 hover:text-primary">
                {post.title}
              </Link>
            </h3>
            <p className="text-gray-600 text-[15px] line-clamp-4 flex-grow">
              {post.short_description}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.user_meta.profile_image}
                    alt={`${post.user_meta.first_name} ${post.user_meta.last_name}`}
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                  <span className="text-[13px] text-gray-600">
                    {post.user_meta.first_name} {post.user_meta.last_name}
                  </span>
                </div>
                <span className="text-[13px] text-gray-500 uppercase font-medium">
                  {formatBlogDate(post.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
