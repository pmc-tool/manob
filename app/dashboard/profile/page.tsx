// User profile page
'use client';

import { useState } from 'react';
import { Form, Input, Button, Upload, Avatar, message, Card } from 'antd';
import { UserOutlined, CameraOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { userApi } from '@/lib/api/user';
import { handleError } from '@/lib/api/error-handler';
import { useRequireAuth, useAuth } from '@/context/AuthContext';

export default function UserProfilePage() {
  useRequireAuth();
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: { name: string; phone?: string }) => {
    try {
      setSaving(true);
      const updatedUser = await userApi.updateProfile(values);
      updateUser(updatedUser);
      message.success('Profile updated successfully');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await userApi.uploadAvatar(file);
      updateUser({ avatar: result.url });
      message.success('Avatar updated');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setUploading(false);
    }
    return false;
  };

  return (
    <DashboardLayout
      title="Profile"
      subtitle="Manage your personal information"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profile' },
      ]}
      requireAuth
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Avatar */}
        <Card className="rounded-2xl text-center">
          <div className="relative mx-auto mb-4 w-fit">
            <Avatar size={100} src={user?.avatar} icon={<UserOutlined />} />
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              disabled={uploading}
            >
              <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                <CameraOutlined />
              </button>
            </Upload>
          </div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </Card>

        {/* Profile Form */}
        <Card title="Personal Information" className="rounded-2xl">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: user?.name,
              email: user?.email,
              phone: user?.phone,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Your name"
              />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                disabled
                className="bg-gray-50"
              />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Your phone number"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Email Verification Status */}
        {user && !user.emailVerified && (
          <Card className="rounded-2xl border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-orange-800">Email not verified</h4>
                <p className="text-sm text-orange-600">
                  Please verify your email to access all features
                </p>
              </div>
              <Button onClick={() => message.info('Verification email sent')}>
                Resend Verification
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
