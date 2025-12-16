// Blog Details Page Route
import { BlogDetails } from '@/components/pmc-migrated/blog';
import { fetchBlogBySlug, fetchAllBlogSlugs } from '@/lib/api/blog';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | manob.ai',
    };
  }

  return {
    title: `${post.title} | manob.ai Blog`,
    description: post.short_description,
    openGraph: {
      title: post.title,
      description: post.short_description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetails singlePostData={post} />;
}
