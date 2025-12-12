// Become seller page
'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Card, Steps, Result, message } from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';
import { sellerApi } from '@/lib/api/seller';
import type { SellerApplication } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { useAuth, useRequireAuth } from '@/context/AuthContext';

const { TextArea } = Input;
const { Option } = Select;

export default function BecomeSellerPage() {
  useRequireAuth();
  const router = useRouter();
  const { user } = useAuth();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<SellerApplication | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);

  useEffect(() => {
    const checkApplication = async () => {
      try {
        setLoading(true);
        const application = await sellerApi.getApplicationStatus();
        setExistingApplication(application);
      } catch {
        // No existing application
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Check if user is already a seller
      if (user.role === 'seller') {
        router.push('/dashboard');
        return;
      }
      checkApplication();
    }
  }, [user, router]);

  const handleSubmit = async (values: {
    businessName: string;
    businessType: string;
    description: string;
  }) => {
    try {
      setSubmitting(true);
      const application = await sellerApi.submitApplication({
        ...values,
        documents,
      });
      setExistingApplication(application);
      message.success('Application submitted successfully!');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Become a Seller" requireAuth>
        <LoadingState message="Loading..." />
      </DashboardLayout>
    );
  }

  // Show application status if exists
  if (existingApplication) {
    return (
      <DashboardLayout
        title="Seller Application"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Seller' }]}
        requireAuth
      >
        <Card className="mx-auto max-w-2xl rounded-2xl">
          {existingApplication.status === 'pending' && (
            <Result
              status="info"
              title="Application Under Review"
              subTitle={`Your application for "${existingApplication.businessName}" is being reviewed. We'll notify you once a decision has been made.`}
              extra={
                <Button onClick={() => router.push('/')}>Back to Home</Button>
              }
            />
          )}
          {existingApplication.status === 'approved' && (
            <Result
              status="success"
              title="Application Approved!"
              subTitle="Congratulations! Your seller account has been approved. You can now start selling on our platform."
              extra={
                <Button type="primary" onClick={() => router.push('/dashboard')}>
                  Go to Seller Dashboard
                </Button>
              }
            />
          )}
          {existingApplication.status === 'rejected' && (
            <Result
              status="error"
              title="Application Rejected"
              subTitle={
                existingApplication.rejectionReason ||
                'Unfortunately, your application was not approved at this time.'
              }
              extra={
                <Button onClick={() => setExistingApplication(null)}>
                  Submit New Application
                </Button>
              }
            />
          )}
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Become a Seller"
      subtitle="Start selling on our marketplace"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Seller' }]}
      requireAuth
    >
      <div className="mx-auto max-w-2xl">
        {/* Benefits */}
        <Card className="mb-6 rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold">Why Sell With Us?</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl">🌍</div>
              <h4 className="font-medium">Global Reach</h4>
              <p className="text-sm text-gray-500">Access millions of customers</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl">💰</div>
              <h4 className="font-medium">Low Fees</h4>
              <p className="text-sm text-gray-500">Competitive commission rates</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl">🛡️</div>
              <h4 className="font-medium">Secure Payments</h4>
              <p className="text-sm text-gray-500">Protected transactions</p>
            </div>
          </div>
        </Card>

        {/* Application Form */}
        <Card title="Seller Application" className="rounded-2xl">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[{ required: true, message: 'Please enter your business name' }]}
            >
              <Input placeholder="Your business or store name" />
            </Form.Item>

            <Form.Item
              name="businessType"
              label="Business Type"
              rules={[{ required: true, message: 'Please select your business type' }]}
            >
              <Select placeholder="Select business type">
                <Option value="individual">Individual</Option>
                <Option value="small_business">Small Business</Option>
                <Option value="company">Company/Corporation</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Business Description"
              rules={[{ required: true, message: 'Please describe your business' }]}
            >
              <TextArea
                rows={4}
                placeholder="Tell us about your business and what you plan to sell"
              />
            </Form.Item>

            <Form.Item label="Supporting Documents (Optional)">
              <Upload
                multiple
                beforeUpload={(file) => {
                  message.info('Document upload will be processed on submit');
                  return false;
                }}
                onChange={(info) => {
                  const urls = info.fileList.map((f) => f.name);
                  setDocuments(urls);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Documents</Button>
              </Upload>
              <p className="mt-2 text-sm text-gray-500">
                Upload business registration, ID, or other relevant documents
              </p>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                size="large"
              >
                Submit Application
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
