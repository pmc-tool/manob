// MIGRATION: Search page from PMC
import { SearchResults } from '@/components/pmc-migrated/product/SearchResults';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function SearchPage() {
  return (
    <DashboardLayout
      title="Search"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
    >
      <SearchResults />
    </DashboardLayout>
  );
}
