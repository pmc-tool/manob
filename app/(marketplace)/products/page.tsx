// MIGRATION: Products listing page from PMC
'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/pmc-migrated/product/ProductGrid';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { productsApi } from '@/lib/api/products';
import type { Product, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProducts({
          page,
          limit: 12,
          sortBy: sortBy as 'newest' | 'price_asc' | 'price_desc' | 'rating',
        });
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortBy]);

  return (
    <DashboardLayout
      title="Products"
      subtitle="Browse our collection of products"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
    >
      <ProductGrid
        products={products}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onSortChange={setSortBy}
        sortBy={sortBy}
      />
    </DashboardLayout>
  );
}
