// MIGRATION: UserInfoSidebar component from PackMyCode
'use client';

import { X, Star, MapPin, Calendar, Mail } from 'lucide-react';
import { ChatUser } from '@/lib/mocks/chat.mock';
import { Avatar } from '../shared/avatar';
import styles from './chat.module.css';

interface UserInfoSidebarProps {
  user: ChatUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInfoSidebar({ user, isOpen, onClose }: UserInfoSidebarProps) {
  if (!user) return null;

  return (
    <div className={`${styles.userInfoSidebar} ${isOpen ? styles.active : ''}`}>
      <div className={styles.userInfoHeader}>
        <h4>User Info</h4>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.userInfoContent}>
        {/* User profile */}
        <div className={styles.userProfile}>
          <Avatar
            avatar={user.receiver_avatar}
            username={user.receiver_name}
            size={80}
            className={styles.userAvatar}
          />
          <h5 className={styles.userName}>{user.receiver_name}</h5>
          <span className={`${styles.userStatus} ${user.is_online ? styles.online : ''}`}>
            {user.is_online ? 'Online' : 'Offline'}
          </span>

          <div className={styles.userRating}>
            <Star className={styles.starIcon} />
            <span>4.9</span>
            <span className={styles.reviewCount}>(128 reviews)</span>
          </div>
        </div>

        {/* User info items */}
        <div className={styles.userInfoItems}>
          <div className={styles.infoItem}>
            <MapPin className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Location</span>
              <span className={styles.infoValue}>New York, USA</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Calendar className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>March 2023</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Mail className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Response Time</span>
              <span className={styles.infoValue}>Within 1 hour</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className={styles.quickActions}>
          <button className={styles.viewProfileBtn}>View Full Profile</button>
        </div>
      </div>
    </div>
  );
}
