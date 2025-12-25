// C2M-requests - Market Support Request Form
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Select, Button, Upload, Typography, Divider, message } from 'antd';
import { Upload as UploadIcon, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock categories - replace with API
const problemCategories = [
  { value: 'subscription', label: 'My subscription' },
  { value: 'downloads', label: 'My downloads' },
  { value: 'payment', label: 'Making a payment' },
  { value: 'licenses', label: 'Licenses' },
  { value: 'invoice', label: 'Invoice and tax' },
  { value: 'account', label: 'Account issues' },
  { value: 'other', label: 'Other' },
];

interface SupportFormValues {
  category: string;
  subject: string;
  message: string;
  name: string;
  email: string;
}

export default function C2MRequestsPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Mock user info - replace with actual auth state
  const userInfo = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
  };
  const isLoggedIn = true; // Replace with actual auth check

  const handleSubmit = async (values: SupportFormValues) => {
    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('message', values.message);
      formData.append('category', values.category);
      formData.append('subject', values.subject);
      formData.append('priority', 'REGULAR');
      formData.append('support_center', 'PMC-SUPPORT-CENTER');

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success('Support ticket submitted successfully!');
      router.push('/support-requests');
    } catch {
      message.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Back Link */}
      <Link href="/support-contact" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} />
        <span>Back to Support Contact</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="mb-2!">Submit a request</Title>
        <Paragraph type="secondary" className="text-base mb-0!">
          You can contact one of our friendly Customer Success team members below.
          Begin by selecting your product we can help you with.
        </Paragraph>
      </div>

      {/* Form Card */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            email: userInfo.email,
          }}
        >
          {/* Start Here Section */}
          <div className="mb-6">
            <Title level={4} className="mb-3!">Start here</Title>
            {!isLoggedIn && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <Text>Existing customer? Sign in to auto-fill your contact details and save time.</Text>
                <Button type="default">Sign In</Button>
              </div>
            )}
          </div>

          {/* Problem Category */}
          <Form.Item
            name="category"
            label={<span className="font-medium">Select your problem by category</span>}
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select a category"
              options={problemCategories}
              size="large"
            />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            name="subject"
            label={<span className="font-medium">Subject</span>}
            rules={[
              { required: true, message: 'Please enter a subject' },
              { min: 5, message: 'Subject must be at least 5 characters' },
              { max: 200, message: 'Subject must be less than 200 characters' },
            ]}
          >
            <Input placeholder="Brief description of your issue" size="large" />
          </Form.Item>

          {/* Message */}
          <Form.Item
            name="message"
            label={<span className="font-medium">Provide a detailed description</span>}
            rules={[
              { required: true, message: 'Please provide a description' },
              { min: 20, message: 'Description must be at least 20 characters' },
            ]}
            extra={
              <Text type="secondary" className="text-xs">
                Please enter the details of your request. Remember: Never share passwords and don't provide
                personal, sensitive or confidential information to anyone you don't know.
              </Text>
            }
          >
            <TextArea
              placeholder="Describe your issue in detail..."
              rows={5}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          {/* Attachments */}
          <Form.Item
            label={<span className="font-medium">Attachments (optional)</span>}
            extra={<Text type="secondary" className="text-xs">Only *.png, *.jpg, *.pdf files are accepted (max 5 files)</Text>}
          >
            <Upload.Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
              maxCount={5}
              accept=".png,.jpg,.jpeg,.pdf"
            >
              <p className="flex justify-center mb-2">
                <UploadIcon size={32} className="text-gray-400" />
              </p>
              <p className="text-sm text-gray-600">Drag files here or click to upload</p>
            </Upload.Dragger>
          </Form.Item>

          <Divider />

          {/* Contact Details Section */}
          <div className="mb-6">
            <Title level={4} className="mb-3!">Contact details</Title>
          </div>

          {/* Name */}
          <Form.Item
            name="name"
            label={<span className="font-medium">Your name</span>}
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
            extra={<Text type="secondary" className="text-xs">What is your full name?</Text>}
          >
            <Input placeholder="Enter your full name" size="large" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label={<span className="font-medium">Your email address</span>}
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
            extra={
              <Text type="secondary" className="text-xs">
                Please provide the email address associated with your PackMyCode account (if applicable).
              </Text>
            }
          >
            <Input placeholder="Enter your email address" size="large" />
          </Form.Item>

          <Divider />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              size="large"
              icon={<Send size={16} />}
              className="px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
