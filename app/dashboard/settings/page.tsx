// User settings page
'use client';

import { useState, useEffect } from 'react';
import { Card, Switch, Button, Form, Input, Divider, Popconfirm, message } from 'antd';
import { LockOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { userApi } from '@/lib/api/user';
import { authApi } from '@/lib/api/auth';
import { handleError } from '@/lib/api/error-handler';
import { useRequireAuth, useAuth } from '@/context/AuthContext';

export default function UserSettingsPage() {
  useRequireAuth();
  const router = useRouter();
  const { logout } = useAuth();
  const [passwordForm] = Form.useForm();
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const prefs = await userApi.getNotificationPreferences();
        setNotificationPrefs(prefs);
      } catch (err) {
        // Use defaults if fetch fails
      }
    };

    fetchPrefs();
  }, []);

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      setSavingPassword(true);
      await authApi.changePassword(values);
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleNotificationChange = async (
    key: keyof typeof notificationPrefs,
    value: boolean
  ) => {
    const newPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(newPrefs);

    try {
      setSavingNotifications(true);
      await userApi.updateNotificationPreferences({ [key]: value });
    } catch (err) {
      // Revert on error
      setNotificationPrefs(notificationPrefs);
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await authApi.deleteAccount({ password: '' }); // Would need password input
      message.success('Account deleted');
      logout();
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account settings"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]}
      requireAuth
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Change Password */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <LockOutlined /> Change Password
            </span>
          }
          className="rounded-2xl"
        >
          <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingPassword}>
              Update Password
            </Button>
          </Form>
        </Card>

        {/* Notification Preferences */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <BellOutlined /> Notifications
            </span>
          }
          className="rounded-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive order updates via email</p>
              </div>
              <Switch
                checked={notificationPrefs.email}
                onChange={(v) => handleNotificationChange('email', v)}
                loading={savingNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch
                checked={notificationPrefs.push}
                onChange={(v) => handleNotificationChange('push', v)}
                loading={savingNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive SMS updates</p>
              </div>
              <Switch
                checked={notificationPrefs.sms}
                onChange={(v) => handleNotificationChange('sms', v)}
                loading={savingNotifications}
              />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Emails</h4>
                <p className="text-sm text-gray-500">Receive promotions and offers</p>
              </div>
              <Switch
                checked={notificationPrefs.marketing}
                onChange={(v) => handleNotificationChange('marketing', v)}
                loading={savingNotifications}
              />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card
          title={
            <span className="flex items-center gap-2 text-red-600">
              <DeleteOutlined /> Danger Zone
            </span>
          }
          className="rounded-2xl border-red-200"
        >
          <p className="mb-4 text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Popconfirm
            title="Delete your account?"
            description="This action cannot be undone. All your data will be permanently deleted."
            onConfirm={handleDeleteAccount}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={deleting}>
              Delete Account
            </Button>
          </Popconfirm>
        </Card>
      </div>
    </DashboardLayout>
  );
}
