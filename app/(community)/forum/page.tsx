// MIGRATION: Forum listing page from PMC
'use client';

import { useState, useEffect } from 'react';
import { Card, Empty, Badge } from 'antd';
import { MessageOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { forumApi } from '@/lib/api/forum';
import type { ForumTopic } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getTopics();
        setTopics(data.topics);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Forum">
        <LoadingState message="Loading forum..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Forum"
      subtitle="Join the community discussion"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Forum' }]}
    >
      {topics.length === 0 ? (
        <Empty description="No forum topics available" />
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/forum/${topic.slug}`}>
              <Card hoverable className="rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <MessageOutlined className="text-xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                      {topic.description && (
                        <p className="text-sm text-gray-500">{topic.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge count={topic.postCount} showZero overflowCount={999}>
                      <span className="text-gray-500">posts</span>
                    </Badge>
                    <RightOutlined className="text-gray-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
