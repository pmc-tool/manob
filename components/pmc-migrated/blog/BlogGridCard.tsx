// Blog Grid Card Component (matching original PMC design)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, formatBlogDate } from '@/lib/api/blog';

interface BlogGridCardProps {
  post: BlogPost;
}

export default function BlogGridCard({ post }: BlogGridCardProps) {
  return (
    <div className="blog-card bg-white rounded-lg shadow h-full border-0 overflow-hidden">
      {/* Image Container with Shape */}
      <div className="blog-card-image relative overflow-hidden">
        <Link href={`/blog/${post.slug || post.id}`}>
          <Image
            src={post.cover_image}
            alt={post.title}
            width={400}
            height={225}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </Link>
        {/* Wave Shape Overlay */}
        <div className="blog-card-shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 100.1"
            className="w-full h-full"
          >
            <path fill="#fff" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z" />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h4 className="blog-card-title font-semibold text-lg mb-3">
          <Link href={`/blog/${post.slug || post.id}`} className="text-gray-900 hover:text-primary">
            {post.title}
          </Link>
        </h4>
        <p className="text-gray-600 text-sm line-clamp-3">{post.short_description}</p>
      </div>

      {/* Card Footer */}
      <div className="bg-transparent border-0 p-4 pt-0">
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
  );
}
