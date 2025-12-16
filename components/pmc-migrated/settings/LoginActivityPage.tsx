// Login Activity Page - Device Sessions
'use client';

import { useState } from 'react';
import { Card, Button, Typography, Divider, Tag, Modal, Empty } from 'antd';
import { Monitor, Smartphone, Tablet, LogOut, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

const { Title, Text } = Typography;

interface DeviceSession {
  device_id: string;
  device_type: string;
  device_icon: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ip_address: string;
  last_login: string;
  is_current_device: boolean;
}

// Mock data for demonstration
const mockDevices: DeviceSession[] = [
  {
    device_id: '1',
    device_type: 'Windows PC',
    device_icon: 'desktop',
    browser: 'Chrome 120',
    location: 'New York, USA',
    ip_address: '192.168.1.xxx',
    last_login: new Date().toISOString(),
    is_current_device: true,
  },
  {
    device_id: '2',
    device_type: 'iPhone 15',
    device_icon: 'mobile',
    browser: 'Safari 17',
    location: 'New York, USA',
    ip_address: '192.168.1.xxx',
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_current_device: false,
  },
  {
    device_id: '3',
    device_type: 'MacBook Pro',
    device_icon: 'desktop',
    browser: 'Chrome 120',
    location: 'Los Angeles, USA',
    ip_address: '172.16.0.xxx',
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_current_device: false,
  },
  {
    device_id: '4',
    device_type: 'iPad Pro',
    device_icon: 'tablet',
    browser: 'Safari 17',
    location: 'San Francisco, USA',
    ip_address: '10.0.0.xxx',
    last_login: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_current_device: false,
  },
];

const DeviceIconComponent = ({ type }: { type: string }) => {
  switch (type) {
    case 'mobile':
      return <Smartphone size={20} className="text-gray-500" />;
    case 'tablet':
      return <Tablet size={20} className="text-gray-500" />;
    default:
      return <Monitor size={20} className="text-gray-500" />;
  }
};

export default function LoginActivityPage() {
  const [devices, setDevices] = useState<DeviceSession[]>(mockDevices);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ visible: boolean; type: 'single' | 'all'; deviceId?: string }>({
    visible: false,
    type: 'single',
  });

  const handleLogoutDevice = async (deviceId: string) => {
    // Mock API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));
    setConfirmModal({ visible: false, type: 'single' });
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDevices((prev) => prev.filter((d) => d.is_current_device));
    } finally {
      setIsLoggingOut(false);
      setConfirmModal({ visible: false, type: 'all' });
    }
  };

  const currentDevice = devices.find((d) => d.is_current_device);
  const otherDevices = devices.filter((d) => !d.is_current_device);

  return (
    <div className="space-y-8">
      {/* Current Device Card */}
      {currentDevice && (
        <Card className="shadow-sm">
          <div className="mb-4">
            <Title level={5} className="mb-1!">Current Session</Title>
            <Text type="secondary" className="text-sm">
              You're currently logged in from this device
            </Text>
          </div>

          <Divider className="my-4!" />

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <DeviceIconComponent type={currentDevice.device_icon} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Text className="font-medium text-gray-900">{currentDevice.device_type}</Text>
                <Tag className="text-xs">Active</Tag>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Monitor size={12} />
                  {currentDevice.browser}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {currentDevice.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Active now
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Other Devices Card */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={5} className="mb-1!">Other Sessions</Title>
            <Text type="secondary" className="text-sm">
              {otherDevices.length > 0
                ? `${otherDevices.length} other device${otherDevices.length > 1 ? 's' : ''} logged in`
                : 'No other active sessions'
              }
            </Text>
          </div>
          {otherDevices.length > 1 && (
            <Button
              danger
              size="small"
              onClick={() => setConfirmModal({ visible: true, type: 'all' })}
            >
              Sign out all
            </Button>
          )}
        </div>

        <Divider className="my-4!" />

        {otherDevices.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No other active sessions"
            className="py-6"
          />
        ) : (
          <div>
            {otherDevices.map((device, index) => (
              <div key={device.device_id}>
                <div className="flex items-center gap-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <DeviceIconComponent type={device.device_icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="font-medium text-gray-900 text-sm block">{device.device_type}</Text>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-gray-500 mt-0.5">
                      <span>{device.browser}</span>
                      <span>·</span>
                      <span>{device.location}</span>
                      <span>·</span>
                      <span>
                        {formatDistanceToNowStrict(new Date(device.last_login), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<LogOut size={14} />}
                    onClick={() => setConfirmModal({ visible: true, type: 'single', deviceId: device.device_id })}
                    className="shrink-0"
                  >
                    Sign out
                  </Button>
                </div>
                {index < otherDevices.length - 1 && <Divider className="my-0!" />}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        title={confirmModal.type === 'all' ? 'Sign out from all devices?' : 'Sign out from this device?'}
        open={confirmModal.visible}
        onCancel={() => setConfirmModal({ visible: false, type: 'single' })}
        footer={[
          <Button key="cancel" onClick={() => setConfirmModal({ visible: false, type: 'single' })}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={isLoggingOut}
            onClick={() => {
              if (confirmModal.type === 'all') {
                handleLogoutAll();
              } else if (confirmModal.deviceId) {
                handleLogoutDevice(confirmModal.deviceId);
              }
            }}
          >
            Sign out
          </Button>,
        ]}
      >
        <p className="text-gray-600">
          {confirmModal.type === 'all'
            ? 'This will sign you out from all other devices. You will need to sign in again on those devices.'
            : 'This will end the session on this device. You will need to sign in again to access your account.'
          }
        </p>
      </Modal>
    </div>
  );
}
