// Edit product page
import { SellerProductForm } from '@/components/pmc-migrated/seller/ProductForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout
      title="Edit Product"
      subtitle="Update your product listing"
      requireAuth
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/dashboard/seller/products' },
        { label: 'Edit Product' },
      ]}
    >
      <SellerNav />
      <SellerProductForm productId={id} />
    </DashboardLayout>
  );
}
