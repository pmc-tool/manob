// MIGRATION: Checkout page from PMC
import { CheckoutForm } from '@/components/pmc-migrated/checkout/CheckoutForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function CheckoutPage() {
  return (
    <DashboardLayout
      title="Checkout"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout' },
      ]}
      requireAuth
    >
      <CheckoutForm />
    </DashboardLayout>
  );
}
