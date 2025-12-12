// MIGRATION: Sign-in form from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses authApi with identical login behavior

'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuth, useAuthRedirect } from '@/context/AuthContext';
import { handleError } from '@/lib/api/error-handler';

interface SignInFormValues {
  email: string;
  password: string;
  remember: boolean;
}

/**
 * Sign In Form Component
 * MIGRATION: Login form with identical PMC behavior
 */
export function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const redirectUrl = useAuthRedirect();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      setLoading(true);

      // CONTRACT: Exact PMC API call pattern
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      // Update auth context
      login(response.session);

      message.success('Welcome back!');

      // Redirect to intended destination or dashboard
      router.push(redirectUrl || '/dashboard');
    } catch (err) {
      const displayError = handleError(err as Parameters<typeof handleError>[0], {
        showToast: true,
      });

      // Show specific field error for invalid credentials
      if (displayError.code === 'INVALID_CREDENTIALS') {
        form.setFields([
          { name: 'password', errors: ['Invalid email or password'] },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-500">Sign in to your account</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="you@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className="mb-6 flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link
              href="/recovery"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider plain className="text-gray-400">
          or continue with
        </Divider>

        {/* Social Login */}
        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          onClick={() => message.info('Google sign-in coming soon')}
        >
          Google
        </Button>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
