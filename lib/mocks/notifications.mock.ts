// Mock data for notifications

export interface NotificationItem {
  id: string;
  notification_title: string;
  notification_body: string;
  type: 'PRODUCT' | 'SERVICE' | 'ORDER' | 'SERVICE_ORDER' | 'JOB' | 'CHAT' | 'SYSTEM' | 'GENERAL';
  created_at: string;
  is_seen: boolean;
  notification_data?: {
    action?: string;
    sender_avatar?: string;
    image?: string;
    item_image?: string;
    order_id?: string;
  };
}

export interface NotificationSection {
  date: string;
  items: NotificationItem[];
}

// Helper function to calculate time ago
export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Helper function to format date
export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Mock notifications data
export const mockNotifications: NotificationSection[] = [
  {
    date: 'Today',
    items: [
      {
        id: '1',
        notification_title: 'New Order Received',
        notification_body: 'You have received a new order for "Premium UI Kit"',
        type: 'ORDER',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        is_seen: false,
        notification_data: {
          action: 'PRODUCT_SALE',
          item_image: 'https://picsum.photos/seed/product1/120/80',
        },
      },
      {
        id: '2',
        notification_title: 'Service Approved',
        notification_body: 'Your service "Web Development" has been approved and is now live.',
        type: 'SERVICE',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        is_seen: false,
        notification_data: {
          action: 'PUBLISHED',
          item_image: 'https://picsum.photos/seed/service1/120/80',
        },
      },
      {
        id: '3',
        notification_title: 'New Message',
        notification_body: 'John Doe sent you a message: "Hi, I have a question about..."',
        type: 'CHAT',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        is_seen: true,
        notification_data: {
          sender_avatar: 'https://i.pravatar.cc/150?img=5',
        },
      },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      {
        id: '4',
        notification_title: 'Order Completed',
        notification_body: 'Order #12345 has been marked as completed. Thank you for your purchase!',
        type: 'SERVICE_ORDER',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        is_seen: true,
        notification_data: {
          action: 'SERVICE_BUY',
          order_id: '12345',
        },
      },
      {
        id: '5',
        notification_title: 'New Job Posted',
        notification_body: 'A new job matching your skills has been posted: "React Developer Needed"',
        type: 'JOB',
        created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        is_seen: true,
        notification_data: {
          action: 'BID_PLACED',
        },
      },
    ],
  },
  {
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: '6',
        notification_title: 'Product Under Review',
        notification_body: 'Your product "Mobile App Template" is currently under review.',
        type: 'PRODUCT',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_seen: true,
        notification_data: {
          action: 'ON_REVIEW',
          item_image: 'https://picsum.photos/seed/product2/120/80',
        },
      },
      {
        id: '7',
        notification_title: 'Welcome to manob.ai!',
        notification_body: 'Thank you for joining. Start exploring our marketplace today!',
        type: 'SYSTEM',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_seen: true,
      },
    ],
  },
];

// Get unseen count
export function getUnseenCount(notifications: NotificationSection[]): number {
  return notifications.reduce((count, section) => {
    return count + section.items.filter(item => !item.is_seen).length;
  }, 0);
}
