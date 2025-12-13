// Blog Featured Card Component (matching original PMC FeaturedPostCard)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, formatBlogDate } from '@/lib/mocks/blog.mock';

interface BlogFeaturedCardProps {
  post: BlogPost;
}

export default function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  return (
    <div
      className="blog-featured-card card h-100 border-0 shadow rounded-lg overflow-hidden"
      style={{
        backgroundImage: 'url(/images/blog/wave-pattern.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundColor: '#ffc7c6',
      }}
    >
      {/* Card Body */}
      <div className="card-body p-4">
        <div className="mb-4">
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
            Featured
          </span>
        </div>
        <h4 className="blog-card-title fw-semibold fz18 mb-3">
          <Link href={`/blog/${post.slug || post.id}`} className="text-primary hover:underline">
            {post.title}
          </Link>
        </h4>
        <p className="text-[#440b0b] fz14 line-clamp-4">{post.short_description}</p>
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-0 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.user_meta && (
              <Image
                src={post.user_meta.profile_image}
                alt={`${post.user_meta.first_name} ${post.user_meta.last_name}`}
                width={30}
                height={30}
                className="rounded-full object-cover"
                unoptimized
              />
            )}
            <span className="fz13 text-[#440b0b]">
              {post.user_meta?.first_name} {post.user_meta?.last_name}
            </span>
          </div>
          <span className="fz13 text-[#440b0b] uppercase font-medium">
            {formatBlogDate(post.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
