'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

export default function DevLoginPage() {
  const { login, logout, isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  const handleDevLogin = async () => {
    await login('demo@packmycode.com', 'password');
    router.push('/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Dev Login</h1>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">Logged in as:</p>
              <p className="text-gray-700">{user?.email}</p>
              <p className="text-gray-500 text-sm">{user?.first_name} {user?.last_name}</p>
            </div>
            <Button
              onClick={handleLogout}
              danger
              block
              size="large"
            >
              Logout
            </Button>
            <Button
              onClick={() => router.push('/')}
              type="primary"
              block
              size="large"
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-4">
              Click below to sign in with a demo account for testing cart functionality.
            </p>
            <Button
              onClick={handleDevLogin}
              type="primary"
              loading={isLoading}
              block
              size="large"
            >
              Sign In (Demo User)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
