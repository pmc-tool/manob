// Blog Page Route
import { BlogPage } from '@/components/pmc-migrated/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'manob.ai Blog - Insights on Code, Digital Products & Tech Trends',
  description:
    'Get expert tips, tutorials, and industry news on manob.ai. Read blog posts and official publications to stay ahead in design, development, and freelancing.',
};

interface BlogPageProps {
  searchParams: Promise<{ query?: string; tag?: string }>;
}

export default async function Blog({ searchParams }: BlogPageProps) {
  const { query, tag } = await searchParams;

  return <BlogPage searchQuery={query} filterTag={tag} />;
}
