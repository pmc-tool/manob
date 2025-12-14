// MIGRATION: LoginActivityPage component from manob.ai
'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, LogOut } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import styles from './settings.module.css';

interface DeviceSession {
  device_id: string;
  device_type: string;
  device_icon: 'desktop' | 'mobile' | 'tablet';
  location: string;
  last_login: string;
  is_current_device: boolean;
}

// Mock data for demonstration
const mockDevices: DeviceSession[] = [
  {
    device_id: '1',
    device_type: 'Chrome on Windows',
    device_icon: 'desktop',
    location: 'New York, USA',
    last_login: new Date().toISOString(),
    is_current_device: true,
  },
  {
    device_id: '2',
    device_type: 'Safari on iPhone',
    device_icon: 'mobile',
    location: 'New York, USA',
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_current_device: false,
  },
  {
    device_id: '3',
    device_type: 'Chrome on MacOS',
    device_icon: 'desktop',
    location: 'Los Angeles, USA',
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_current_device: false,
  },
];

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'mobile':
      return <Smartphone size={24} />;
    case 'tablet':
      return <Tablet size={24} />;
    default:
      return <Monitor size={24} />;
  }
};

interface DeviceSessionCardProps {
  device: DeviceSession;
  onLogout: () => void;
  isLastChild: boolean;
}

function DeviceSessionCard({ device, onLogout, isLastChild }: DeviceSessionCardProps) {
  return (
    <div className={`${styles.deviceCard} ${isLastChild ? styles.noBorder : ''}`}>
      <div className={styles.deviceIcon}>
        <DeviceIcon type={device.device_icon} />
      </div>
      <div className={styles.deviceInfo}>
        <div className={styles.deviceName}>
          {device.device_type}
          {device.is_current_device && (
            <span className={styles.currentBadge}>Current Device</span>
          )}
        </div>
        <div className={styles.deviceMeta}>
          <span>{device.location}</span>
          <span className={styles.dot}>•</span>
          <span>
            {device.is_current_device
              ? 'Active now'
              : formatDistanceToNowStrict(new Date(device.last_login), { addSuffix: true })}
          </span>
        </div>
      </div>
      {!device.is_current_device && (
        <button
          type="button"
          className={styles.logoutDeviceBtn}
          onClick={onLogout}
          title="Sign out from this device"
        >
          <LogOut size={18} />
        </button>
      )}
    </div>
  );
}

export default function LoginActivityPage() {
  const [devices, setDevices] = useState<DeviceSession[]>(mockDevices);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutDevice = (deviceId: string) => {
    // Mock API call - replace with actual API
    setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));
    console.log('Logged out device:', deviceId);
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Keep only current device
      setDevices((prev) => prev.filter((d) => d.is_current_device));
      console.log('Logged out from all devices');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={styles.settingsCard}>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h2>Recent Devices</h2>
          <p className={styles.muted}>
            View your recent devices logged into your account, enhancing security and
            session management effortlessly.
          </p>
        </div>

        <div className={styles.formSection}>
          {devices.map((device, index) => (
            <DeviceSessionCard
              key={device.device_id}
              device={device}
              onLogout={() => handleLogoutDevice(device.device_id)}
              isLastChild={index === devices.length - 1}
            />
          ))}

          {devices.length === 0 && (
            <div className={styles.emptyState}>
              <p>No active sessions found.</p>
            </div>
          )}
        </div>

        {devices.length > 1 && (
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleLogoutAll}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out from all devices'}
          </button>
        )}
      </div>
    </div>
  );
}
