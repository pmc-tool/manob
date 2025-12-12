// MIGRATION: QuestionDetailPage component from PackMyCode
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNowStrict } from 'date-fns';
import { Pin, Star, CheckCircle, ArrowDown, PenLine } from 'lucide-react';
import CommentCard from './CommentCard';
import ForumSidebar from './ForumSidebar';
import {
  mockForumQuestions,
  mockForumComments,
  mockTopContributors,
  mockTopQuestions,
  mockForumCurrentUser,
  ForumQuestion,
  ForumComment,
  formatNumber,
} from '@/lib/mocks/forum.mock';
import styles from './forum.module.css';

interface QuestionDetailPageProps {
  questionId: string;
}

export default function QuestionDetailPage({ questionId }: QuestionDetailPageProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState<ForumQuestion | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [sortOption, setSortOption] = useState<string>('ASC');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load question and comments
  useEffect(() => {
    const q = mockForumQuestions.find((q) => q.id === questionId);
    if (q) {
      setQuestion(q);
      setComments(mockForumComments[questionId] || []);
    } else {
      router.push('/404');
    }
  }, [questionId, router]);

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortOption === 'DESC') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === 'likes') {
      return b.total_likes - a.total_likes;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const totalReplies = comments.length;
  const solvedComment = comments.find((c) => c.is_right_answer);
  const hasSolution = comments.some((c) => c.is_right_answer);

  // Stats for sidebar
  const stats = question
    ? [
        { label: 'Replies', value: formatNumber(totalReplies) },
        { label: 'Created', value: formatDistanceToNowStrict(new Date(question.created_at)) },
        {
          label: 'Last Reply',
          value: totalReplies > 0 ? formatDistanceToNowStrict(new Date(comments[0]?.created_at)) : 'N/A',
        },
      ]
    : [];

  const scrollToSolution = () => {
    solutionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVote = (type: 'LIKE' | 'DISLIKE', id: string) => {
    console.log('Vote:', type, id);
    // MOCK: Would update vote via API
  };

  const handleMarkAsSolution = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => ({
        ...c,
        is_right_answer: c.id === commentId,
      }))
    );
    if (question) {
      setQuestion({ ...question, is_solved: true });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);

    // MOCK: Create new comment
    const newComment: ForumComment = {
      id: `c-${Date.now()}`,
      forum_id: questionId,
      body: `<p>${replyContent}</p>`,
      creator_meta: mockForumCurrentUser,
      total_likes: 0,
      is_right_answer: false,
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      setComments((prev) => [...prev, newComment]);
      setReplyContent('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleEdit = () => {
    router.push(`/forum/questions/${questionId}/edit`);
  };

  if (!question) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner} />
        <p>Loading question...</p>
      </div>
    );
  }

  // Parse HTML content safely
  const renderContent = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const isAuthor = question.creator_meta.id === mockForumCurrentUser.id;

  return (
    <div className={styles.forumContainer}>
      <div className={styles.forumContent}>
        <div className={styles.forumMain}>
          {/* Question header */}
          <div className={styles.questionDetailHeader}>
            <h1>{question.title}</h1>
            <div className={styles.questionMeta}>
              <div className={styles.questionMetaText}>
                <span className={styles.muted}>Asked</span>{' '}
                <span>{formatDistanceToNowStrict(new Date(question.created_at), { addSuffix: true })}</span>{' '}
                <span className={styles.muted}>Viewed</span>{' '}
                <span>{question.views} times</span>
              </div>
              <div className={styles.questionStatusIcons}>
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

          {/* Solved banner */}
          {question.is_solved && solvedComment && (
            <div className={styles.solvedBanner}>
              <div>
                <span className={styles.muted}>Solved by</span>{' '}
                <span className={styles.bold}>
                  {solvedComment.creator_meta.first_name} {solvedComment.creator_meta.last_name}
                </span>
                {solvedComment.solved_at && (
                  <span className={styles.muted}>
                    , {formatDistanceToNowStrict(new Date(solvedComment.solved_at), { addSuffix: true })}
                  </span>
                )}
              </div>
              <button type="button" className={styles.goToSolutionBtn} onClick={scrollToSolution}>
                Go to solution <ArrowDown size={14} />
              </button>
            </div>
          )}

          {/* Question body as first comment */}
          <div className={styles.commentWrapper}>
            <div className={styles.commentContent}>
              <div className={`${styles.commentCard} ${question.is_pinned ? styles.commentPinned : ''}`}>
                <div className={styles.commentInner}>
                  <div className={styles.commentBody}>
                    <div className={styles.commentText}>{renderContent(question.body)}</div>
                    <div className={styles.commentFooter}>
                      {isAuthor && !question.is_solved && (
                        <button type="button" className={styles.editBtn} onClick={handleEdit}>
                          <PenLine size={16} /> Edit
                        </button>
                      )}
                      <span className={styles.answeredTime}>
                        <span className={styles.muted}>asked</span>{' '}
                        {formatDistanceToNowStrict(new Date(question.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers header */}
          <div className={styles.answersHeader}>
            <h4>{totalReplies} Answers</h4>
            <div className={styles.filterWrapper}>
              <span>Order by: </span>
              <select
                className={styles.filterSelect}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="ASC">Oldest</option>
                <option value="DESC">Newest</option>
                <option value="likes">Votes</option>
              </select>
            </div>
          </div>

          {/* Answers list */}
          {sortedComments.map((comment) => (
            <div key={comment.id} ref={comment.is_right_answer ? solutionRef : null}>
              <CommentCard
                comment={comment}
                authorMeta={question.creator_meta}
                onReply={scrollToEditor}
                onVote={handleVote}
                onMarkAsSolution={() => handleMarkAsSolution(comment.id)}
                onPinRequest={(reason) => console.log('Pin request:', comment.id, reason)}
                isQuestionAuthor={isAuthor}
                showSolutionButton={!question.is_solved}
                hasSolution={hasSolution}
                posts={question.total_posts}
                solutions={question.total_solution}
                showPinRequestButton={true}
              />
            </div>
          ))}

          {/* Reply form */}
          <div className={styles.replyFormWrapper} ref={editorRef}>
            <div className={styles.replyFormCard}>
              <h4>Join the conversation</h4>
              <p className={styles.muted}>
                Join the forum conversation and connect with others on topics that matter to you.
              </p>
              <form onSubmit={handleReplySubmit}>
                <textarea
                  className={styles.replyTextarea}
                  placeholder="Write your answer..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={6}
                />
                <div className={styles.replyFormActions}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Your Answer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.forumSidebarWrapper}>
          <ForumSidebar
            stats={stats}
            topContributors={mockTopContributors}
            topQuestions={mockTopQuestions}
          />
        </div>
      </div>
    </div>
  );
}
