// Notification Settings Page
'use client';

import { useState } from 'react';
import { Card, Switch, Typography, Divider } from 'antd';
import { Bell, Mail, Megaphone, MessageSquare, ShoppingBag, AlertCircle } from 'lucide-react';

const { Title, Text } = Typography;

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const notificationSettings: NotificationSetting[] = [
  {
    key: 'push',
    label: 'Push Notifications',
    description: 'Receive instant notifications for important updates',
    icon: <Bell size={18} />,
  },
  {
    key: 'email',
    label: 'Email Notifications',
    description: 'Get email alerts for account activity and updates',
    icon: <Mail size={18} />,
  },
  {
    key: 'order',
    label: 'Order Updates',
    description: 'Notifications about your orders and deliveries',
    icon: <ShoppingBag size={18} />,
  },
  {
    key: 'messages',
    label: 'Message Alerts',
    description: 'Get notified when you receive new messages',
    icon: <MessageSquare size={18} />,
  },
  {
    key: 'marketing',
    label: 'Marketing & Promotions',
    description: 'Receive promotional emails and special offers',
    icon: <Megaphone size={18} />,
  },
  {
    key: 'security',
    label: 'Security Alerts',
    description: 'Important notifications about account security',
    icon: <AlertCircle size={18} />,
  },
];

export default function NotificationPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    order: true,
    messages: true,
    marketing: false,
    security: true,
  });

  const handleToggle = (key: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: checked }));
    // Mock API call - replace with actual API
    console.log('Notification setting updated:', key, checked);
  };

  return (
    <div className="space-y-8">
      {/* Notification Settings Card */}
      <Card className="shadow-sm">
        <div className="mb-5">
          <Title level={5} className="mb-1!">Manage Notifications</Title>
          <Text type="secondary" className="text-sm">
            Control which notifications you receive and how
          </Text>
        </div>

        <Divider className="my-4!" />

        <div>
          {notificationSettings.map((setting, index) => (
            <div key={setting.key}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                    {setting.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{setting.label}</div>
                    <div className="text-sm text-gray-500">{setting.description}</div>
                  </div>
                </div>
                <Switch
                  checked={settings[setting.key]}
                  onChange={(checked) => handleToggle(setting.key, checked)}
                />
              </div>
              {index < notificationSettings.length - 1 && (
                <Divider className="my-0!" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Info Note */}
      <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <AlertCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
        <Text className="text-sm text-gray-600">
          Security alerts cannot be disabled to ensure your account remains protected.
        </Text>
      </div>
    </div>
  );
}
