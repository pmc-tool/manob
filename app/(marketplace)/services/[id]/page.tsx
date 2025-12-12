// MIGRATION: Service detail page from PMC
'use client';

import { useState, useEffect, use } from 'react';
import { Button, Rate, Tag, Card, Tabs, message } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { productsApi } from '@/lib/api/products';
import type { Service } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getService(id);
        setService(data);
      } catch (err) {
        setError(handleError(err as Parameters<typeof handleError>[0]));
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading service..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  if (!service) return null;

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: service.title },
      ]}
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
            {service.thumbnail ? (
              <Image
                src={service.thumbnail}
                alt={service.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Title & Rating */}
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">{service.title}</h1>
            <div className="mt-2 flex items-center gap-4">
              <Rate disabled defaultValue={service.rating} />
              <span className="text-gray-500">
                {service.rating.toFixed(1)} ({service.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultActiveKey="description"
            items={[
              {
                key: 'description',
                label: 'Description',
                children: (
                  <div className="prose max-w-none">
                    <p>{service.description}</p>
                  </div>
                ),
              },
              {
                key: 'reviews',
                label: `Reviews (${service.reviewCount})`,
                children: (
                  <p className="text-gray-500">No reviews yet</p>
                ),
              },
            ]}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          />
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-4 rounded-2xl">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {service.currency} {service.price}
                  {service.priceType === 'hourly' && '/hr'}
                </p>
                <Tag className="mt-2">
                  {service.priceType === 'fixed'
                    ? 'Fixed Price'
                    : service.priceType === 'hourly'
                    ? 'Hourly Rate'
                    : 'Project Based'}
                </Tag>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-600">
                <ClockCircleOutlined />
                <span>Delivery in {service.deliveryTime} days</span>
              </div>

              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={() => message.info('Service booking coming soon')}
              >
                Book Service
              </Button>

              <Button size="large" block>
                Contact Seller
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
