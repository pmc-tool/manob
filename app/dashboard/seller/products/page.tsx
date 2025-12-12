// Seller products page
import { SellerProductList } from '@/components/pmc-migrated/seller/ProductList';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';

export default function SellerProductsPage() {
  return (
    <DashboardLayout
      title="Products"
      subtitle="Manage your product listings"
      requireAuth
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products' },
      ]}
    >
      <SellerNav />
      <SellerProductList />
    </DashboardLayout>
  );
}
