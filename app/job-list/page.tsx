// Job List Page - matching PMC design
import { Metadata } from 'next';
import { JobListPage } from '@/components/pmc-migrated/job-list';

export const metadata: Metadata = {
  title: 'Post a Job & Hire Expert Developers | manob.ai',
  description:
    'Need reliable service for web design, development, mobile app, or tech? Post your job on manob.ai and connect with skilled coders ready to serve your project.',
};

export default function Page() {
  return <JobListPage />;
}
