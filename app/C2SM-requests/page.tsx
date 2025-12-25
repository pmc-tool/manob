// C2SM-requests - Product Support Request Form
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Select, Button, Upload, Typography, Divider, message, Alert, Tag } from 'antd';
import { Upload as UploadIcon, Send, ArrowLeft, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock categories - replace with API
const problemCategories = [
  { value: 'bug', label: 'Bug or issue' },
  { value: 'installation', label: 'Installation help' },
  { value: 'customization', label: 'Customization request' },
  { value: 'documentation', label: 'Documentation question' },
  { value: 'feature', label: 'Feature request' },
  { value: 'other', label: 'Other' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'URGENT', label: 'Urgent' },
];

// Mock purchased products - replace with API
const purchasedProducts = [
  { value: 'prod-1', label: 'Premium React Dashboard', supportDays: 45 },
  { value: 'prod-2', label: 'E-commerce Template Pro', supportDays: 120 },
  { value: 'prod-3', label: 'Mobile App UI Kit', supportDays: 0 },
];

interface SupportFormValues {
  product: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  name: string;
  email: string;
}

export default function C2SMRequestsPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Mock user info - replace with actual auth state
  const userInfo = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
  };
  const isLoggedIn = true; // Replace with actual auth check

  const selectedProductData = purchasedProducts.find((p) => p.value === selectedProduct);
  const supportExpired = selectedProductData?.supportDays === 0;

  const handleSubmit = async (values: SupportFormValues) => {
    if (supportExpired) {
      message.error('Support period has expired for this product.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('message', values.message);
      formData.append('category', values.category);
      formData.append('subject', values.subject);
      formData.append('priority', values.priority);
      formData.append('product', values.product);
      formData.append('support_center', 'PRODUCT-SUPPORT-CENTER');

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
        <Title level={2} className="mb-2!">Product Support Request</Title>
        <Paragraph type="secondary" className="text-base mb-0!">
          Get help from the product author. Submit a ticket to receive expert support for your purchased product.
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
            priority: 'REGULAR',
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

          {/* Product Selection */}
          <Form.Item
            name="product"
            label={<span className="font-medium">Select your purchased product</span>}
            rules={[{ required: true, message: 'Please select a product' }]}
          >
            <Select
              placeholder="Select a product"
              options={purchasedProducts.map((p) => ({
                value: p.value,
                label: (
                  <div className="flex items-center justify-between">
                    <span>{p.label}</span>
                    {p.supportDays === 0 ? (
                      <Tag color="red" className="ml-2">Expired</Tag>
                    ) : (
                      <Tag color="green" className="ml-2">{p.supportDays} days left</Tag>
                    )}
                  </div>
                ),
              }))}
              size="large"
              onChange={(value) => setSelectedProduct(value)}
            />
          </Form.Item>

          {/* Support Duration Alert */}
          {selectedProduct && (
            <div className="mb-4">
              {supportExpired ? (
                <Alert
                  type="error"
                  message="Support Expired"
                  description="The support period for this product has expired. Please purchase extended support to submit a ticket."
                  showIcon
                  icon={<Clock size={18} />}
                />
              ) : (
                <Alert
                  type="info"
                  message={
                    <span className="flex items-center gap-2">
                      <Package size={16} />
                      Support Duration: {selectedProductData?.supportDays} days remaining
                    </span>
                  }
                  showIcon={false}
                />
              )}
            </div>
          )}

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

          {/* Priority */}
          <Form.Item
            name="priority"
            label={<span className="font-medium">Priority level</span>}
            rules={[{ required: true, message: 'Please select a priority' }]}
          >
            <Select
              placeholder="Select priority"
              options={priorityOptions}
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
                Describe your issue in detail. Include steps to reproduce, expected behavior, and any error messages.
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
            extra={<Text type="secondary" className="text-xs">Screenshots or files that help explain your issue (max 5 files)</Text>}
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
              disabled={supportExpired}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
