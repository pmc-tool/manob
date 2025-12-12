// Seller analytics page
import { SellerAnalytics } from '@/components/pmc-migrated/seller/Analytics';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { SellerNav } from '@/components/pmc-migrated/seller/SellerNav';

export default function SellerAnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Track your sales performance"
      requireAuth
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics' },
      ]}
    >
      <SellerNav />
      <SellerAnalytics />
    </DashboardLayout>
  );
}
