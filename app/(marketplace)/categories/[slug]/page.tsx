// MIGRATION: Category detail page from PMC
'use client';

import { useState, useEffect, use } from 'react';
import { ProductGrid } from '@/components/pmc-migrated/product/ProductGrid';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { categoriesApi } from '@/lib/api/categories';
import { productsApi } from '@/lib/api/products';
import type { Category, Product, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoryData, productsData] = await Promise.all([
          categoriesApi.getCategory(slug),
          productsApi.getProducts({
            categoryId: slug,
            page,
            limit: 12,
            sortBy: sortBy as 'newest' | 'price_asc' | 'price_desc' | 'rating',
          }),
        ]);

        setCategory(categoryData);
        setProducts(productsData.products);
        setPagination(productsData.pagination);
      } catch (err) {
        setError(handleError(err as Parameters<typeof handleError>[0]));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, page, sortBy]);

  if (loading && !category) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading category..." />
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

  if (!category) return null;

  return (
    <DashboardLayout
      title={category.name}
      subtitle={category.description || `${category.productCount} products`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: category.name },
      ]}
    >
      <ProductGrid
        products={products}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onSortChange={setSortBy}
        sortBy={sortBy}
        emptyText={`No products in ${category.name}`}
      />
    </DashboardLayout>
  );
}
