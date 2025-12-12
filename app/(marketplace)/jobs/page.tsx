// MIGRATION: Jobs listing page from PMC
'use client';

import { useState, useEffect } from 'react';
import { Empty, Card, Tag, Pagination as AntPagination } from 'antd';
import { DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { productsApi } from '@/lib/api/products';
import type { Job, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getJobs({ page, limit: 12 });
        setJobs(data.jobs);
        setPagination(data.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  if (loading) {
    return (
      <DashboardLayout title="Jobs">
        <LoadingState message="Loading jobs..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Jobs"
      subtitle="Find freelance opportunities"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Jobs' }]}
    >
      {jobs.length === 0 ? (
        <Empty description="No jobs available" />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card hoverable className="rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Tag
                          color={
                            job.status === 'open'
                              ? 'green'
                              : job.status === 'in_progress'
                              ? 'blue'
                              : 'default'
                          }
                        >
                          {job.status.replace('_', ' ').toUpperCase()}
                        </Tag>
                        <span className="text-sm text-gray-500">
                          {job.category?.name}
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold hover:text-blue-600">
                        {job.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-gray-600">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Tag key={skill}>{skill}</Tag>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${job.budget}
                      </p>
                      <p className="text-sm text-gray-500">
                        {job.budgetType === 'fixed' ? 'Fixed' : 'Hourly'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <UserOutlined />
                      {job.applicantCount} applicants
                    </span>
                    {job.deadline && (
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        Due: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </span>
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
