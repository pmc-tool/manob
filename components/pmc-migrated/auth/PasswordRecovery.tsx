// MIGRATION: Password recovery from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses authApi with identical recovery behavior

'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Result, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { handleError } from '@/lib/api/error-handler';

/**
 * Password Recovery Component
 * MIGRATION: Request password reset email with identical PMC behavior
 */
export function PasswordRecovery() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);

      // CONTRACT: Exact PMC API call pattern
      await authApi.requestPasswordRecovery({ email: values.email });

      setSentToEmail(values.email);
      setEmailSent(true);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <Result
            status="success"
            title="Check your email"
            subTitle={
              <>
                We've sent a password reset link to{' '}
                <strong>{sentToEmail}</strong>. Please check your inbox and
                follow the instructions.
              </>
            }
            extra={[
              <Button
                key="resend"
                onClick={() => {
                  setEmailSent(false);
                  form.resetFields();
                }}
              >
                Send again
              </Button>,
              <Link key="signin" href="/sign-in">
                <Button type="primary">Back to Sign In</Button>
              </Link>,
            ]}
          />
          <p className="mt-4 text-center text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => {
                setEmailSent(false);
                form.resetFields();
              }}
              className="text-blue-600 hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="mt-2 text-gray-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Sign In */}
        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftOutlined />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecovery;
