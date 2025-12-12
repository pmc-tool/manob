// MIGRATION: QuestionCard component from PackMyCode
'use client';

import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { Pin, Star, CheckCircle } from 'lucide-react';
import { Avatar } from '../shared/avatar';
import { ForumQuestion } from '@/lib/mocks/forum.mock';
import styles from './forum.module.css';

interface QuestionCardProps {
  question: ForumQuestion;
  searchTerm?: string;
}

const highlightMatch = (text: string, term?: string) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span key={i} className={styles.highlight}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

export default function QuestionCard({ question, searchTerm }: QuestionCardProps) {
  const plainTextBody = question.body.replace(/<\/?[^>]+(>|$)/g, '');

  return (
    <div
      className={`${styles.questionCard} ${question.is_solved ? styles.solved : ''} ${
        question.is_featured ? styles.featured : ''
      } ${question.is_pinned ? styles.pinned : ''}`}
    >
      <div className={styles.questionCardInner}>
        {/* Avatar and stats */}
        <div className={styles.questionCardAvatar}>
          <div className={styles.avatarWrapper}>
            <Avatar
              avatar={question.creator_meta.profile_image}
              username={`${question.creator_meta.first_name} ${question.creator_meta.last_name || ''}`}
              size={50}
            />
          </div>
          <div className={styles.questionStats}>
            <span>{question.total_comments} replies</span>
            <span className={styles.muted}>{question.views} views</span>
            <span className={styles.muted}>{question.total_likes} votes</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.questionCardContent}>
          <h5 className={styles.questionTitle}>
            <Link href={`/forum/question/${question.id}`}>
              {highlightMatch(question.title, searchTerm)}
            </Link>
          </h5>
          <p className={styles.questionExcerpt}>
            {highlightMatch(plainTextBody.substring(0, 200), searchTerm)}
            {plainTextBody.length > 200 && '...'}
          </p>
        </div>

        {/* Status icons */}
        <div className={styles.questionCardActions}>
          <div className={styles.statusIcons}>
            {question.is_pinned && (
              <span className={styles.pinnedIcon} title="Pinned">
                <Pin size={18} />
              </span>
            )}
            {question.is_featured && (
              <span className={styles.featuredIcon} title="Featured">
                <Star size={18} />
              </span>
            )}
            {question.is_solved && (
              <span className={styles.solvedIcon} title="Solved">
                <CheckCircle size={18} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Time ago */}
      <div className={styles.questionTime}>
        <span className={styles.muted}>asked </span>
        <span className={styles.timeAgo}>
          {formatDistanceToNowStrict(new Date(question.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
