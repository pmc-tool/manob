// MIGRATION: Sign-up form from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses authApi with identical signup behavior

'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { handleError } from '@/lib/api/error-handler';

interface SignUpFormValues {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

/**
 * Sign Up Form Component
 * MIGRATION: Registration form with identical PMC behavior
 */
export function SignUpForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      setLoading(true);

      // CONTRACT: Exact PMC API call pattern
      const response = await authApi.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      message.success('Account created! Please verify your email.');

      // Redirect to OTP verification if required
      if (response.requiresOTP) {
        router.push(`/otp?userId=${response.userId}`);
      } else {
        router.push('/sign-in');
      }
    } catch (err) {
      const displayError = handleError(err as Parameters<typeof handleError>[0], {
        showToast: true,
      });

      // Show specific field errors
      if (displayError.code === 'ALREADY_EXISTS') {
        form.setFields([
          { name: 'email', errors: ['This email is already registered'] },
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
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-2 text-gray-500">Join us to start shopping</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="John Doe"
              size="large"
              autoComplete="name"
            />
          </Form.Item>

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

          <Form.Item name="phone" label="Phone Number (Optional)">
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="+1 (555) 000-0000"
              size="large"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Create a password"
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
              placeholder="Confirm your password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('You must accept the terms and conditions')
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Create Account
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
          onClick={() => message.info('Google sign-up coming soon')}
        >
          Google
        </Button>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
