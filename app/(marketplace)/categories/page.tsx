// MIGRATION: Categories listing page from PMC
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { CategoryList, CategoryCard } from '@/components/pmc-migrated/product/CategoryList';
import { categoriesApi } from '@/lib/api/categories';
import type { Category } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesApi.getCategories();
        setCategories(data.categories);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Categories">
        <LoadingState message="Loading categories..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Categories"
      subtitle="Browse products by category"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
    >
      <div className="space-y-8">
        {/* Featured Categories */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Featured Categories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">All Categories</h2>
          <CategoryList categories={categories} layout="list" />
        </section>
      </div>
    </DashboardLayout>
  );
}
