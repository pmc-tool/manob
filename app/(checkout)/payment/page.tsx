// MIGRATION: Payment page from PMC
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaymentForm } from '@/components/pmc-migrated/checkout/PaymentForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(handleError(err as Parameters<typeof handleError>[0]));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <DashboardLayout title="Payment" requireAuth>
        <LoadingState message="Loading order..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Payment" requireAuth>
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  if (!order) return null;

  return (
    <DashboardLayout
      title="Payment"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout', href: '/checkout' },
        { label: 'Payment' },
      ]}
      requireAuth
    >
      <PaymentForm
        order={order}
        onCancel={() => router.push('/checkout')}
      />
    </DashboardLayout>
  );
}
