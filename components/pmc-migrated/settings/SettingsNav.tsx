// MIGRATION: SettingsNav component from manob.ai
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Bell, Smartphone } from 'lucide-react';
import styles from './settings.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/settings/security', label: 'Security', icon: <Shield size={18} /> },
  { path: '/settings/notification', label: 'Notification', icon: <Bell size={18} /> },
  { path: '/settings/login-activity', label: 'Login Activity', icon: <Smartphone size={18} /> },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className={styles.settingsNav}>
      <h3 className={styles.navTitle}>Settings</h3>
      <nav className={styles.navList}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
