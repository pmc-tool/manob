// MIGRATION: Seller dashboard navigation from PMC
// VIPER: Visual consistency with Engine design system

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Products',
    href: '/dashboard/seller/products',
    icon: <ShoppingOutlined />,
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: <InboxOutlined />,
  },
  {
    label: 'Analytics',
    href: '/dashboard/seller/analytics',
    icon: <BarChartOutlined />,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <SettingOutlined />,
  },
];

/**
 * Seller Navigation Component
 * MIGRATION: Internal navigation for seller dashboard pages
 */
export function SellerNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="mb-6 border-b border-gray-200">
      <div className="flex space-x-1 overflow-x-auto pb-px">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors
              ${
                isActive(item.href)
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/**
 * Seller Dashboard Header
 * MIGRATION: Header component with title and actions
 */
export function SellerDashboardHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default SellerNav;
