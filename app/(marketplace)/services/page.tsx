// MIGRATION: Services listing page from PMC
'use client';

import { useState, useEffect } from 'react';
import { Empty, Card, Rate, Tag, Pagination as AntPagination } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { productsApi } from '@/lib/api/products';
import type { Service, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getServices({ page, limit: 12 });
        setServices(data.services);
        setPagination(data.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page]);

  if (loading) {
    return (
      <DashboardLayout title="Services">
        <LoadingState message="Loading services..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Services"
      subtitle="Browse professional services"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
    >
      {services.length === 0 ? (
        <Empty description="No services available" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card
                  hoverable
                  className="overflow-hidden rounded-2xl"
                  cover={
                    <div className="relative h-48 bg-gray-100">
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
                  }
                >
                  <p className="mb-1 text-xs text-gray-500">
                    {service.category?.name}
                  </p>
                  <h3 className="mb-2 line-clamp-2 font-medium">
                    {service.title}
                  </h3>
                  <div className="mb-2 flex items-center gap-2">
                    <Rate disabled defaultValue={service.rating} className="text-sm" />
                    <span className="text-sm text-gray-500">
                      ({service.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      {service.currency} {service.price}
                      {service.priceType === 'hourly' && '/hr'}
                    </p>
                    <Tag>{service.deliveryTime} days</Tag>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-6">
              <AntPagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
