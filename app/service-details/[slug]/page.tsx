// Service Details page
import { ServiceDetailsPage } from '@/components/pmc-migrated/service-details';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // In production, fetch service data and use real title/description
  return {
    title: `Service Details | manob.ai`,
    description: 'View service details, packages, reviews, and seller information on manob.ai marketplace.',
  };
}

export default async function ServiceDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // In production, fetch service data here using the slug
  // const service = await fetchService(slug);

  return <ServiceDetailsPage />;
}
