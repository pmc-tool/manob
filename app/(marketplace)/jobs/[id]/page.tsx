// MIGRATION: Job detail page from PMC
'use client';

import { useState, useEffect, use } from 'react';
import { Button, Tag, Card, Descriptions, message } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { productsApi } from '@/lib/api/products';
import type { Job } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getJob(id);
        setJob(data);
      } catch (err) {
        setError(handleError(err as Parameters<typeof handleError>[0]));
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading job..." />
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

  if (!job) return null;

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: job.title },
      ]}
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="mb-4 flex items-center gap-2">
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
              <span className="text-gray-500">{job.category?.name}</span>
            </div>
            <h1 className="text-2xl font-bold lg:text-3xl">{job.title}</h1>
          </div>

          {/* Description */}
          <Card title="Job Description" className="rounded-2xl">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </Card>

          {/* Skills */}
          <Card title="Required Skills" className="rounded-2xl">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Tag key={skill} className="rounded-full px-3 py-1">
                  {skill}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Details */}
          <Card title="Job Details" className="rounded-2xl">
            <Descriptions column={2}>
              <Descriptions.Item label="Budget Type">
                {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
              </Descriptions.Item>
              <Descriptions.Item label="Budget">
                ${job.budget} {job.budgetType === 'hourly' && '/hr'}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {job.category?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Applicants">
                {job.applicantCount}
              </Descriptions.Item>
              <Descriptions.Item label="Posted">
                {new Date(job.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              {job.deadline && (
                <Descriptions.Item label="Deadline">
                  {new Date(job.deadline).toLocaleDateString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-4 rounded-2xl">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${job.budget}
                </p>
                <p className="text-gray-500">
                  {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>{job.applicantCount} applicants</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center gap-2">
                    <CalendarOutlined />
                    <span>Due: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {job.status === 'open' && (
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<SendOutlined />}
                  onClick={() => message.info('Job applications coming soon')}
                >
                  Apply Now
                </Button>
              )}

              <Button size="large" block>
                Save Job
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
