// MIGRATION: NotificationCard component from PackMyCode
'use client';

import Image from 'next/image';
import { NotificationItem } from '@/lib/mocks/notifications.mock';

interface NotificationCardProps {
  notification: NotificationItem;
  timeAgo: string;
  onClick?: () => void;
  compact?: boolean;
}

export default function NotificationCard({
  notification,
  timeAgo,
  onClick,
  compact = false,
}: NotificationCardProps) {
  const userImage = notification.notification_data?.sender_avatar || 'https://i.pravatar.cc/150?img=3';
  const itemImage = notification.notification_data?.image || notification.notification_data?.item_image;

  return (
    <div className="relative flex w-full gap-2.5 mt-3 first:mt-0">
      {/* Timeline dot */}
      <span className="inline-flex flex-shrink-0 justify-center items-center w-6 h-6 rounded-full bg-gray-200 before:block before:w-1.5 before:h-1.5 before:bg-gray-700 before:rounded-full after:absolute after:border-l-2 after:border-gray-200 after:top-7 after:left-[11px] after:h-[calc(100%-28px)] last:after:hidden" />
      <div
        className={`flex-1 border rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 break-words ${
          !notification.is_seen ? 'bg-green-50 border-green-200' : 'border-gray-200'
        } ${compact ? 'p-2' : 'p-3'}`}
        onClick={onClick}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {itemImage ? (
              <Image
                width={compact ? 60 : 80}
                height={compact ? 40 : 50}
                src={itemImage}
                alt="Notification"
                className="rounded-lg object-cover"
              />
            ) : (
              <Image
                width={compact ? 36 : 46}
                height={compact ? 36 : 46}
                src={userImage}
                alt="User"
                className="rounded-lg object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">{timeAgo}</span>
            </div>
            <h6
              className={`font-semibold text-gray-900 capitalize m-0 mb-1 ${
                compact ? 'text-[13px] line-clamp-2' : 'text-sm'
              }`}
            >
              {notification.notification_title?.replace(/_/g, ' ')}
            </h6>
            {notification.notification_body && (
              <p
                className={`text-gray-500 m-0 leading-snug ${
                  compact ? 'text-xs line-clamp-2' : 'text-[13px]'
                }`}
              >
                {notification.notification_body}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
