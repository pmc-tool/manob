// Settings Tab Navigation Component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Bell, Smartphone } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/settings/security',
    label: 'Security',
    icon: <Shield size={16} />
  },
  {
    path: '/settings/notification',
    label: 'Notifications',
    icon: <Bell size={16} />
  },
  {
    path: '/settings/login-activity',
    label: 'Login Activity',
    icon: <Smartphone size={16} />
  },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200">
      <nav className="flex justify-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors shrink-0
                ${isActive
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
