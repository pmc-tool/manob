// Security Settings Page - Change Password
'use client';

import { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Divider } from 'antd';
import { Lock, KeyRound, CheckCircle2, Info } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

interface PasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function SecurityPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (_values: PasswordFormValues) => {
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Password changed successfully!');
      form.resetFields();
    } catch {
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRules = [
    'At least 8 characters',
    'One uppercase letter',
    'One lowercase letter',
    'One number',
    'One special character (@$!%*?&#)',
  ];

  return (
    <div className="space-y-8">
      {/* Change Password Card */}
      <Card className="shadow-sm">
        <div className="mb-5">
          <Title level={5} className="mb-1!">Change Password</Title>
          <Text type="secondary" className="text-sm">
            Update your password to keep your account secure
          </Text>
        </div>

        <Divider className="my-4!" />

        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            icon={<CheckCircle2 size={16} />}
            className="mb-6"
            closable
          />
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-3">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="old_password"
                label={<span className="text-sm font-medium text-gray-700">Current Password</span>}
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password
                  prefix={<KeyRound size={16} className="text-gray-400" />}
                  placeholder="Enter your current password"
                  maxLength={50}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="new_password"
                label={<span className="text-sm font-medium text-gray-700">New Password</span>}
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
                    message: 'Password must include uppercase, lowercase, number and special character',
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<Lock size={16} className="text-gray-400" />}
                  placeholder="Enter a new password"
                  maxLength={50}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label={<span className="text-sm font-medium text-gray-700">Confirm New Password</span>}
                dependencies={['new_password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<Lock size={16} className="text-gray-400" />}
                  placeholder="Re-enter your new password"
                  maxLength={50}
                  size="large"
                />
              </Form.Item>

              <Form.Item className="mb-0! pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  size="large"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Password Requirements Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-gray-500" />
                <Text className="text-sm font-medium text-gray-700">Password Requirements</Text>
              </div>
              <ul className="space-y-2">
                {passwordRules.map((rule, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    {rule}
                  </li>
                ))}
              </ul>
              <Paragraph type="secondary" className="mt-3! mb-0! text-xs">
                Choose a password you haven't used before.
              </Paragraph>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
