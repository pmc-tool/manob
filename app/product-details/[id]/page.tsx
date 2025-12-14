// Product Details page
import { ProductDetailsPage } from '@/components/pmc-migrated/product-details';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // In production, fetch product data and use real title/description
  return {
    title: `Product Details | manob.ai`,
    description: 'View product details, reviews, and purchase options on manob.ai marketplace.',
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // In production, fetch product data here using the id
  // const product = await fetchProduct(id);

  return <ProductDetailsPage />;
}
