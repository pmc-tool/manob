// MIGRATION: CommentCard component from manob.ai
'use client';

import { format, formatDistanceToNowStrict } from 'date-fns';
import { ChevronUp, ChevronDown, Reply, Check, CheckCheck, Pin, Info, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../shared/avatar';
import { ForumComment, ForumUser } from '@/lib/mocks/forum.mock';
import styles from './forum.module.css';

interface CommentCardProps {
  comment: ForumComment;
  authorMeta?: ForumUser;
  onReply?: () => void;
  onVote?: (type: 'LIKE' | 'DISLIKE', id: string) => void;
  onMarkAsSolution?: () => void;
  onPinRequest?: (reason: string) => void;
  isQuestionAuthor?: boolean;
  showSolutionButton?: boolean;
  hasSolution?: boolean;
  posts?: number;
  solutions?: number;
  isPinned?: boolean;
  isPinRequestSubmitted?: boolean;
  showPinRequestButton?: boolean;
}

export default function CommentCard({
  comment,
  authorMeta,
  onReply,
  onVote,
  onMarkAsSolution,
  onPinRequest,
  isQuestionAuthor = false,
  showSolutionButton = false,
  hasSolution = false,
  posts = 0,
  solutions = 0,
  isPinned = false,
  isPinRequestSubmitted = false,
  showPinRequestButton = false,
}: CommentCardProps) {
  const [userVote, setUserVote] = useState<'LIKE' | 'DISLIKE' | null>(
    comment.is_liked ? 'LIKE' : comment.is_disliked ? 'DISLIKE' : null
  );
  const [likes, setLikes] = useState(comment.total_likes);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinReason, setPinReason] = useState('');
  const [pinError, setPinError] = useState('');

  const isAuthor = comment.creator_meta.id === authorMeta?.id;

  const handlePinRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinReason.trim()) {
      setPinError('This field is required');
      return;
    }
    if (pinReason.length < 10) {
      setPinError('Message must be at least 10 characters long');
      return;
    }
    if (pinReason.length > 1000) {
      setPinError('Message must be at most 1000 characters long');
      return;
    }
    onPinRequest?.(pinReason);
    setIsPinModalOpen(false);
    setPinReason('');
    setPinError('');
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPinReason('');
    setPinError('');
  };

  const handleVote = (type: 'LIKE' | 'DISLIKE') => {
    if (userVote === type) {
      // Remove vote
      setUserVote(null);
      setLikes(type === 'LIKE' ? likes - 1 : likes + 1);
    } else {
      // Change vote
      if (userVote) {
        setLikes(type === 'LIKE' ? likes + 2 : likes - 2);
      } else {
        setLikes(type === 'LIKE' ? likes + 1 : likes - 1);
      }
      setUserVote(type);
    }
    onVote?.(type, comment.id);
  };

  // Parse HTML content safely
  const renderContent = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className={styles.commentWrapper}>
      {/* Voting sidebar - desktop */}
      <div className={styles.commentSidebar}>
        <div className={styles.voteActions}>
          <button
            type="button"
            className={`${styles.voteBtn} ${userVote === 'LIKE' ? styles.voteActive : ''}`}
            onClick={() => handleVote('LIKE')}
            title="Good research; clear and useful"
          >
            <ChevronUp size={18} />
          </button>
          <span className={styles.voteCount}>{likes}</span>
          <button
            type="button"
            className={`${styles.voteBtn} ${userVote === 'DISLIKE' ? styles.voteDownActive : ''}`}
            onClick={() => handleVote('DISLIKE')}
            title="Lacks research; unclear or useless"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        {onReply && (
          <button type="button" className={styles.replyBtn} onClick={onReply} title="Reply">
            <Reply size={20} />
          </button>
        )}
      </div>

      {/* Comment content */}
      <div className={styles.commentContent}>
        <div
          className={`${styles.commentCard} ${comment.is_right_answer ? styles.commentSolved : ''} ${
            isPinned ? styles.commentPinned : ''
          }`}
        >
          <div className={styles.commentInner}>
            {/* Avatar section */}
            <div className={styles.commentAvatar}>
              <Avatar
                avatar={comment.creator_meta.profile_image}
                username={`${comment.creator_meta.first_name} ${comment.creator_meta.last_name || ''}`}
                size={80}
              />
              <div className={styles.commentUserStats}>
                {posts > 0 && <span>{posts} posts</span>}
                {solutions > 0 && <span className={styles.muted}>{solutions} solutions</span>}
              </div>
            </div>

            {/* Body section */}
            <div className={styles.commentBody}>
              <div className={styles.commentMeta}>
                <span className={styles.muted}>Posted: </span>
                <span>{comment.created_at ? format(new Date(comment.created_at), 'MMMM d, yyyy') : ''}</span>
              </div>

              <div className={styles.commentText}>{renderContent(comment.body)}</div>

              {/* Footer */}
              <div className={styles.commentFooter}>
                {comment.updated_at && (
                  <span className={styles.editedTime}>
                    <span className={styles.muted}>edited </span>
                    {formatDistanceToNowStrict(new Date(comment.updated_at), { addSuffix: true })}
                  </span>
                )}
                <span className={styles.answeredTime}>
                  <span className={styles.muted}>answered </span>
                  {formatDistanceToNowStrict(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {isAuthor && <span className={styles.authorBadge}>Author</span>}
                {comment.is_right_answer && (
                  <span className={styles.solutionBadge}>
                    <Check size={14} /> Solution
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile voting */}
          <div className={styles.mobileVotes}>
            <button
              type="button"
              className={`${styles.voteBtn} ${userVote === 'LIKE' ? styles.voteActive : ''}`}
              onClick={() => handleVote('LIKE')}
            >
              <ChevronUp size={16} />
            </button>
            <span>{likes}</span>
            <button
              type="button"
              className={`${styles.voteBtn} ${userVote === 'DISLIKE' ? styles.voteDownActive : ''}`}
              onClick={() => handleVote('DISLIKE')}
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className={styles.commentActions}>
          {isPinned && (
            <span className={styles.pinnedLabel}>
              <Pin size={14} /> Pinned
            </span>
          )}
          {showSolutionButton && isQuestionAuthor && !hasSolution && (
            <button
              type="button"
              className={styles.markSolutionBtn}
              onClick={onMarkAsSolution}
              disabled={comment.is_right_answer}
            >
              {comment.is_right_answer ? (
                <>
                  <CheckCheck size={16} /> Marked as Solution
                </>
              ) : (
                <>
                  <Check size={16} /> Mark as Solution
                </>
              )}
            </button>
          )}
          {/* Pin Request - 3 states: Pinned, Request Submitted, or Request button */}
          {showPinRequestButton && (
            isPinned ? (
              <button type="button" className={styles.pinnedBtn} disabled>
                <Pin size={14} /> Pinned
              </button>
            ) : isPinRequestSubmitted ? (
              <button type="button" className={styles.pinRequestBtn} disabled>
                <Pin size={14} /> Pin Request Submitted
              </button>
            ) : (
              <button
                type="button"
                className={styles.pinRequestBtn}
                onClick={() => setIsPinModalOpen(true)}
              >
                <Pin size={14} /> Pin Request
              </button>
            )
          )}
        </div>
      </div>

      {/* Pin Request Modal */}
      {isPinModalOpen && (
        <div className={styles.modalOverlay} onClick={closePinModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Request to Pin a Forum Post</h3>
              <button type="button" className={styles.modalClose} onClick={closePinModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePinRequestSubmit}>
              <div className={styles.modalBody}>
                <label className={styles.formLabel}>
                  Why Should This Post Be Pinned? <span className={styles.required}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  rows={7}
                  placeholder="Explain how this post helps the community. For example, is it a tutorial, FAQ, major fix, or official announcement?"
                  value={pinReason}
                  onChange={(e) => {
                    setPinReason(e.target.value);
                    setPinError('');
                  }}
                />
                {pinError && <p className={styles.formError}>{pinError}</p>}

                <div className={styles.infoBox}>
                  <Info size={20} className={styles.infoIcon} />
                  <div>
                    <em>
                      <strong>Note:</strong> Submitting this form does not guarantee that your post
                      will be pinned. All requests are reviewed by moderators based on content
                      quality and relevance.
                    </em>
                  </div>
                </div>
                <p className={styles.muted}>
                  You can pin your post for 7 days. After that, it will be unpinned automatically.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={closePinModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
