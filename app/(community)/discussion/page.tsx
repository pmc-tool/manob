// MIGRATION: Discussions page from PMC
'use client';

import { useState, useEffect } from 'react';
import { Card, Empty, Button, Tag, Pagination as AntPagination } from 'antd';
import { PlusOutlined, LikeOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { forumApi } from '@/lib/api/forum';
import type { Discussion, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getDiscussions({ page, limit: 10 });
        setDiscussions(data.discussions);
        setPagination(data.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [page]);

  if (loading) {
    return (
      <DashboardLayout title="Discussions">
        <LoadingState message="Loading discussions..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Discussions"
      subtitle="Community discussions and conversations"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Discussions' }]}
      actions={
        <Button type="primary" icon={<PlusOutlined />}>
          Start Discussion
        </Button>
      }
    >
      {discussions.length === 0 ? (
        <Empty description="No discussions yet" />
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Link key={discussion.id} href={`/discussion/${discussion.id}`}>
              <Card hoverable className="rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Tag color="blue">{discussion.category}</Tag>
                      {discussion.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold hover:text-blue-600">
                      {discussion.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-gray-600">
                      {discussion.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {discussion.author.name}</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <EyeOutlined /> {discussion.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageOutlined /> {discussion.replyCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <LikeOutlined /> {discussion.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

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
