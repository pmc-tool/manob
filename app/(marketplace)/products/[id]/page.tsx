// MIGRATION: Product detail page from PMC
import { ProductDetail } from '@/components/pmc-migrated/product/ProductDetail';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout maxWidth="2xl">
      <ProductDetail productId={id} />
    </DashboardLayout>
  );
}
