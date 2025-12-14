// Forum questions list page
'use client';

import { Suspense } from 'react';
import { QuestionsPage } from '@/components/pmc-migrated/forum';

export default function ForumQuestionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionsPage />
    </Suspense>
  );
}
