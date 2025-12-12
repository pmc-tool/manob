// New product page
import { SellerProductForm } from '@/components/pmc-migrated/seller/ProductForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';

export default function NewProductPage() {
  return (
    <DashboardLayout
      title="Add New Product"
      subtitle="Create a new product listing"
      requireAuth
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/dashboard/seller/products' },
        { label: 'New Product' },
      ]}
    >
      <SellerNav />
      <SellerProductForm />
    </DashboardLayout>
  );
}
