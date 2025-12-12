// MIGRATION: Discussion detail page from PMC
'use client';

import { useState, useEffect, use } from 'react';
import { Card, Tag, Button, message } from 'antd';
import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { forumApi } from '@/lib/api/forum';
import type { Discussion } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getDiscussion(id);
        setDiscussion(data);
      } catch (err) {
        setError(handleError(err as Parameters<typeof handleError>[0]));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading discussion..." />
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

  if (!discussion) return null;

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Discussions', href: '/discussion' },
        { label: discussion.title },
      ]}
      maxWidth="2xl"
    >
      <Card className="rounded-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Tag color="blue">{discussion.category}</Tag>
            {discussion.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <h1 className="mb-4 text-2xl font-bold">{discussion.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>By {discussion.author.name}</span>
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
            <span>{discussion.viewCount} views</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-6">
          <p className="whitespace-pre-wrap">{discussion.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
          <Button icon={<LikeOutlined />}>
            Like ({discussion.likeCount})
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              message.success('Link copied to clipboard');
            }}
          >
            Share
          </Button>
        </div>
      </Card>

      {/* Replies Section */}
      <Card title={`Replies (${discussion.replyCount})`} className="mt-6 rounded-2xl">
        <p className="text-gray-500">Replies will be displayed here</p>
      </Card>
    </DashboardLayout>
  );
}
