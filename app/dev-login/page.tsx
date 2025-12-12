// DEV ONLY: Dummy login page for testing role-based routing
'use client';

import { Card, Button, Space, Typography, Alert } from 'antd';
import { UserOutlined, ShopOutlined, CrownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { User, AuthSession } from '@/lib/api/types';

const { Title, Text } = Typography;

const dummyUsers: Record<string, User> = {
  user: {
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    emailVerified: true,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  seller: {
    id: 'seller-456',
    email: 'seller@example.com',
    name: 'Jane Shop',
    role: 'seller',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  admin: {
    id: 'admin-789',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function DevLoginPage() {
  const router = useRouter();
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = (role: 'user' | 'seller' | 'admin') => {
    const dummySession: AuthSession = {
      user: dummyUsers[role],
      accessToken: `dummy-access-token-${role}`,
      refreshToken: `dummy-refresh-token-${role}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    login(dummySession);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md rounded-2xl text-center">
          <Title level={4}>Loading...</Title>
          <Text type="secondary">Checking authentication status</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <div className="mb-6 text-center">
          <Title level={3}>Dev Login</Title>
          <Text type="secondary">Select a role to test the dashboard</Text>
        </div>

        <Alert
          message="Development Only"
          description="This page is for testing purposes only. Remove before production."
          type="warning"
          showIcon
          className="mb-6"
        />

        {isAuthenticated && user ? (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <Text strong>Currently logged in as:</Text>
            <div className="mt-2">
              <Text>{user.name}</Text>
              <br />
              <Text type="secondary">{user.email}</Text>
              <br />
              <Text code>{user.role.toUpperCase()}</Text>
            </div>
            <Button
              danger
              className="mt-4"
              onClick={handleLogout}
              block
            >
              Logout
            </Button>
          </div>
        ) : null}

        <Space direction="vertical" size="middle" className="w-full">
          <Button
            size="large"
            icon={<UserOutlined />}
            onClick={() => handleLogin('user')}
            block
            className="h-16"
          >
            <span className="ml-2">
              <strong>Login as User</strong>
              <br />
              <small>View buyer dashboard, orders, profile</small>
            </span>
          </Button>

          <Button
            size="large"
            type="primary"
            icon={<ShopOutlined />}
            onClick={() => handleLogin('seller')}
            block
            className="h-16"
          >
            <span className="ml-2">
              <strong>Login as Seller</strong>
              <br />
              <small>View seller dashboard, products, analytics</small>
            </span>
          </Button>

          <Button
            size="large"
            icon={<CrownOutlined />}
            onClick={() => handleLogin('admin')}
            block
            className="h-16 bg-purple-600 text-white hover:bg-purple-700"
          >
            <span className="ml-2">
              <strong>Login as Admin</strong>
              <br />
              <small>Full access to all features</small>
            </span>
          </Button>
        </Space>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <Text strong>Test URLs:</Text>
          <ul className="mt-2 space-y-1 text-sm">
            <li><code>/dashboard</code> - Main dashboard</li>
            <li><code>/dashboard/orders</code> - Orders</li>
            <li><code>/dashboard/profile</code> - Profile</li>
            <li><code>/dashboard/settings</code> - Settings</li>
            <li><code>/dashboard/seller/products</code> - Products (seller)</li>
            <li><code>/dashboard/seller/analytics</code> - Analytics (seller)</li>
            <li><code>/become-seller</code> - Become seller</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
