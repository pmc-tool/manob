// Service Details page - Fetches real data from API
import { ServiceDetailsPage } from '@/components/pmc-migrated/service-details';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Convert slug to title format for SEO
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${title} | manob.ai`,
    description: 'View service details, packages, reviews, and seller information on manob.ai marketplace.',
  };
}

export default async function ServiceDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Pass the slug to ServiceDetailsPage which fetches real data
  return <ServiceDetailsPage slug={slug} />;
}
