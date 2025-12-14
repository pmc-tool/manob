// MIGRATION: ChatList component from manob.ai
'use client';

import { FileText, Image as ImageIcon } from 'lucide-react';
import { ChatUser } from '@/lib/mocks/chat.mock';
import { Avatar } from '../shared/avatar';
import styles from './chat.module.css';

interface ChatItemProps {
  chat: ChatUser;
  isActive: boolean;
  currentUserId: string;
  onClick: () => void;
}

function ChatItem({ chat, isActive, currentUserId, onClick }: ChatItemProps) {
  const isSeen = chat.last_message_status === 'READ' || chat.sended_by === currentUserId;
  const hasAttachment = chat.attachments && chat.attachments.length > 0;
  const lastAttachment = hasAttachment ? chat.attachments[chat.attachments.length - 1] : null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div
      className={`${styles.chatItem} ${isActive ? styles.active : ''} ${isSeen ? styles.seen : styles.unseen}`}
      onClick={onClick}
    >
      <div className={styles.avatarWrapper}>
        <Avatar
          avatar={chat.receiver_avatar}
          username={chat.receiver_name}
          size={48}
        />
        <span className={`${styles.status} ${chat.is_online ? styles.online : styles.offline}`} />
      </div>

      <div className={styles.infoText}>
        <div className={styles.nameRow}>
          <h5>{chat.receiver_name}</h5>
          <span className={styles.time}>{formatTime(chat.last_message_at)}</span>
        </div>
        <p className={styles.lastMessage}>
          {chat.is_typing ? (
            <i className={styles.typing}>Typing...</i>
          ) : hasAttachment && !chat.last_message ? (
            <>
              {lastAttachment?.mimetype?.includes('image') ? (
                <ImageIcon className={styles.attachIcon} />
              ) : (
                <FileText className={styles.attachIcon} />
              )}
              {lastAttachment?.filename}
            </>
          ) : (
            chat.last_message
          )}
        </p>
      </div>
    </div>
  );
}

interface ChatListProps {
  chats: Record<string, ChatUser>;
  activeUserId: string | null;
  currentUserId: string;
  onSelectChat: (userId: string, chat: ChatUser) => void;
}

export default function ChatList({ chats, activeUserId, currentUserId, onSelectChat }: ChatListProps) {
  const chatArray = Object.entries(chats).sort(
    ([, a], [, b]) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  );

  return (
    <div className={styles.chatList}>
      <h2 className={styles.chatListTitle}>Recent Chat</h2>
      <div className={styles.chatListItems}>
        {chatArray.map(([userId, chat]) => (
          <ChatItem
            key={userId}
            chat={chat}
            isActive={activeUserId === userId}
            currentUserId={currentUserId}
            onClick={() => onSelectChat(userId, chat)}
          />
        ))}
      </div>
    </div>
  );
}
