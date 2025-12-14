// Blog Details Page Route
import { BlogDetails } from '@/components/pmc-migrated/blog';
import { getBlogBySlug, mockBlogPosts } from '@/lib/mocks/blog.mock';
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
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | manob.ai',
    };
  }

  return {
    title: `${post.title} | manob.ai Blog`,
    description: post.short_description,
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetails singlePostData={post} />;
}
