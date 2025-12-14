// MIGRATION: NotificationDropdown component from manob.ai
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import NotificationCard from './NotificationCard';
import {
  NotificationSection,
  NotificationItem,
  mockNotifications,
  calculateTimeAgo,
  formatNotificationDate,
} from '@/lib/mocks/notifications.mock';

interface NotificationDropdownProps {
  onClose?: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationSection[]>(mockNotifications);

  const hasNotifications = notifications.length > 0 && notifications.some(s => s.items.length > 0);

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(section => ({
        ...section,
        items: section.items.map(item => ({ ...item, is_seen: true })),
      }))
    );
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setNotifications(prev =>
      prev.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.id === notification.id ? { ...item, is_seen: true } : item
        ),
      }))
    );
    onClose?.();
    // Navigate to appropriate page based on notification type
    console.log('Notification clicked:', notification);
  };

  return (
    <div className="w-[380px] max-h-[500px] bg-white rounded-xl shadow-xl overflow-hidden">
      {hasNotifications ? (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Notifications</span>
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-[350px] overflow-y-auto p-3">
            {notifications.map((section, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {['Today', 'Yesterday'].includes(section.date)
                    ? section.date
                    : formatNotificationDate(section.date)}
                </div>
                <div className="flex flex-col">
                  {section.items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      notification={item}
                      timeAgo={calculateTimeAgo(item.created_at)}
                      onClick={() => handleNotificationClick(item)}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/notifications"
            className="flex items-center justify-center gap-1 p-3 border-t border-gray-200 text-sm font-medium text-emerald-600 hover:bg-gray-50 no-underline"
          >
            View all Notifications
            <ChevronRight size={14} />
          </Link>
        </>
      ) : (
        <div className="py-12 px-6 text-center">
          <div className="text-gray-300 mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <h5 className="text-base font-semibold text-gray-700 m-0 mb-2">No Notifications Yet</h5>
          <p className="text-sm text-gray-500 m-0">
            When a notification is received, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
