// MIGRATION: Reset password from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses authApi with identical reset behavior

'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Result, message } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { handleError } from '@/lib/api/error-handler';

/**
 * Reset Password Component
 * MIGRATION: Set new password with token from email
 */
export function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      message.error('Invalid or missing reset token');
      router.push('/recovery');
    }
  }, [token, router]);

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!token) return;

    try {
      setLoading(true);

      // CONTRACT: Exact PMC API call pattern
      await authApi.resetPassword({
        token,
        password: values.password,
      });

      setSuccess(true);
    } catch (err) {
      const displayError = handleError(err as Parameters<typeof handleError>[0], {
        showToast: true,
      });

      // Handle expired/invalid token
      if (displayError.code === 'TOKEN_INVALID' || displayError.code === 'TOKEN_EXPIRED') {
        message.error('Reset link has expired. Please request a new one.');
        router.push('/recovery');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <Result
            status="success"
            icon={<CheckCircleOutlined className="text-green-500" />}
            title="Password reset successful!"
            subTitle="Your password has been updated. You can now sign in with your new password."
            extra={
              <Link href="/sign-in">
                <Button type="primary" size="large">
                  Sign In
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-gray-500">Enter your new password below</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter new password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm new password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          {/* Password Requirements */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Password must contain:
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Sign In */}
        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-gray-500 hover:text-gray-700">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
