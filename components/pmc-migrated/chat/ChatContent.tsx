// MIGRATION: ChatContent component from manob.ai
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, CheckCheck, FileText, Download } from 'lucide-react';
import { ChatMessage, ChatUser } from '@/lib/mocks/chat.mock';
import { Avatar } from '../shared/avatar';
import styles from './chat.module.css';

interface ChatContentProps {
  messages: ChatMessage[];
  activeUser: ChatUser | null;
  currentUserId: string;
  isTyping: boolean;
}

export default function ChatContent({ messages, activeUser, currentUserId, isTyping }: ChatContentProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleScroll = () => {
    if (divRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 200;
      setShowScrollToBottom(!isAtBottom);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Group messages by date
  const groupedByDate: Record<string, ChatMessage[]> = {};
  messages.forEach((msg) => {
    const dateKey = new Date(msg.sended_at).toDateString();
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(msg);
  });

  // Group consecutive messages by sender
  const groupMessagesBySender = (msgs: ChatMessage[]) => {
    const groups: { sender_id: string; messages: ChatMessage[] }[] = [];
    msgs.forEach((msg) => {
      const last = groups[groups.length - 1];
      if (last && last.sender_id === msg.sender_id) {
        last.messages.push(msg);
      } else {
        groups.push({ sender_id: msg.sender_id, messages: [msg] });
      }
    });
    return groups;
  };

  return (
    <>
      <div className={styles.messageContentInner} ref={divRef} onScroll={handleScroll}>
        {Object.entries(groupedByDate).map(([dateKey, msgs], i) => {
          const dateLabel = formatDateLabel(msgs[0].sended_at);
          const groupedMessages = groupMessagesBySender(msgs);

          return (
            <React.Fragment key={i}>
              <div className={styles.dateLabel}>
                <hr />
                <span>{dateLabel}</span>
                <hr />
              </div>

              {groupedMessages.map((group, j) => {
                const isSelf = group.sender_id === currentUserId;

                return (
                  <div className={`${styles.message} ${isSelf ? styles.me : ''}`} key={j}>
                    {!isSelf && activeUser && (
                      <Avatar
                        avatar={activeUser.receiver_avatar}
                        username={activeUser.receiver_name}
                        size={36}
                        className={styles.messageAvatar}
                      />
                    )}
                    <div className={styles.textMain}>
                      <div className={styles.textGroup}>
                        {group.messages.map((msg, k) => (
                          <React.Fragment key={k}>
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className={styles.attachmentList}>
                                {msg.attachments.map((att, ai) => (
                                  <div key={ai} className={styles.attachmentItem}>
                                    {att.mimetype?.includes('image') ? (
                                      <img
                                        src={att.url}
                                        alt={att.filename}
                                        className={styles.attachmentImage}
                                      />
                                    ) : (
                                      <div className={styles.attachmentDoc}>
                                        <FileText size={24} />
                                        <div className={styles.attachmentInfo}>
                                          <span className={styles.attachmentName}>{att.filename}</span>
                                          <span className={styles.attachmentSize}>
                                            {(att.size / 1024).toFixed(1)} KB
                                          </span>
                                        </div>
                                        <button className={styles.downloadBtn}>
                                          <Download size={16} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Text message */}
                            {msg.message && msg.message_type !== 'ORDER' && (
                              <div className={`${styles.text} ${isSelf ? styles.textMe : ''}`}>
                                <p>{msg.message}</p>
                                <span className={styles.textSendingTime}>
                                  {formatTime(msg.sended_at)}
                                  {isSelf && (
                                    <CheckCheck
                                      className={`${styles.checkIcon} ${msg.status === 'READ' ? styles.seen : ''}`}
                                      size={14}
                                    />
                                  )}
                                </span>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {isTyping && activeUser && (
          <div className={styles.message}>
            <Avatar
              avatar={activeUser.receiver_avatar}
              username={activeUser.receiver_name}
              size={36}
              className={styles.messageAvatar}
            />
            <div className={styles.textMain}>
              <div className={styles.textGroup}>
                <div className={`${styles.text} ${styles.typing}`}>
                  <div className={styles.wave}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button onClick={scrollToBottom} className={styles.scrollBottomBtn} aria-label="Scroll to bottom">
          <ChevronDown size={18} />
        </button>
      )}
    </>
  );
}
