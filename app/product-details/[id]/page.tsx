// Product Details page - Fetches real data from API
import { ProductDetailsPage } from '@/components/pmc-migrated/product-details';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Convert slug to title format for SEO
  const title = id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${title} | manob.ai`,
    description: 'View product details, reviews, and purchase options on manob.ai marketplace.',
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Pass the slug to ProductDetailsPage which fetches real data
  return <ProductDetailsPage slug={id} />;
}
