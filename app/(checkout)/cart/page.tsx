// MIGRATION: Cart page from PMC
import { CartView } from '@/components/pmc-migrated/checkout/CartView';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function CartPage() {
  return (
    <DashboardLayout
      title="Shopping Cart"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cart' }]}
    >
      <CartView />
    </DashboardLayout>
  );
}
