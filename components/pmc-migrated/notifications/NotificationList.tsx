// MIGRATION: NotificationList component from PackMyCode
'use client';

import { useState } from 'react';
import NotificationCard from './NotificationCard';
import {
  NotificationSection,
  mockNotifications,
  calculateTimeAgo,
  formatNotificationDate,
  getUnseenCount,
} from '@/lib/mocks/notifications.mock';
import styles from './notifications.module.css';

export default function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationSection[]>(mockNotifications);
  const [currentPage, setCurrentPage] = useState(1);

  const totalNotifications = notifications.reduce((count, section) => count + section.items.length, 0);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((item) => ({ ...item, is_seen: true })),
      }))
    );
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === notificationId ? { ...item, is_seen: true } : item
        ),
      }))
    );
    // In real app, would navigate based on notification type
    console.log('Notification clicked:', notificationId);
  };

  return (
    <div className={styles.notificationPage}>
      <div className={styles.pageHeader}>
        <h2>Notifications ({totalNotifications})</h2>
        <button onClick={markAllAsRead} className={styles.markAllBtnPage}>
          Mark all as read
        </button>
      </div>

      <div className={styles.notificationsList}>
        {notifications.map((section, index) => (
          <div key={index} className={styles.notificationSectionPage}>
            <div className={styles.sectionDatePage}>
              {['Today', 'Yesterday'].includes(section.date)
                ? section.date
                : formatNotificationDate(section.date)}
            </div>
            <div className={styles.sectionItemsPage}>
              {section.items.map((item) => (
                <NotificationCard
                  key={item.id}
                  notification={item}
                  timeAgo={calculateTimeAgo(item.created_at)}
                  onClick={() => handleNotificationClick(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className={styles.emptyStatePage}>
          <div className={styles.emptyIcon}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <h3>No notifications available</h3>
          <p>When you receive notifications, they will appear here.</p>
        </div>
      )}
    </div>
  );
}
