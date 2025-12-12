// Forum question detail page
'use client';

import { use } from 'react';
import { QuestionDetailPage } from '@/components/pmc-migrated/forum';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ForumQuestionPage({ params }: PageProps) {
  const { id } = use(params);
  return <QuestionDetailPage questionId={id} />;
}
