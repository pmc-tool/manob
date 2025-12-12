// MIGRATION: Forum topic page from PMC
'use client';

import { useState, useEffect, use } from 'react';
import { Card, Empty, Button, Pagination as AntPagination, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { forumApi } from '@/lib/api/forum';
import type { ForumTopic, ForumPost, Pagination } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

export default function ForumTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = use(params);
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [topicData, postsData] = await Promise.all([
          forumApi.getTopic(topicSlug),
          forumApi.getPosts(topicSlug, { page, limit: 10 }),
        ]);
        setTopic(topicData);
        setPosts(postsData.posts);
        setPagination(postsData.pagination);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicSlug, page]);

  if (loading && !topic) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={topic?.title || 'Forum Topic'}
      subtitle={topic?.description}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Forum', href: '/forum' },
        { label: topic?.title || 'Topic' },
      ]}
      actions={
        <Button type="primary" icon={<PlusOutlined />}>
          New Post
        </Button>
      }
    >
      {posts.length === 0 ? (
        <Empty description="No posts in this topic" />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} hoverable className="rounded-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {post.isPinned && <Tag color="gold">Pinned</Tag>}
                    {post.isLocked && <Tag>Locked</Tag>}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold hover:text-blue-600">
                    {post.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-gray-600">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {post.author.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <EyeOutlined /> {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageOutlined /> {post.replyCount}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
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
