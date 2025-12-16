// Support Contact Page - Hub for different support centers
'use client';

import Link from 'next/link';
import { Card, Button, Typography } from 'antd';
import { Users, MessageCircle, Headset, ArrowRight } from 'lucide-react';

const { Title, Text } = Typography;

export default function SupportContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Title level={2} className="mb-2!">Support Contact PackMyCode</Title>
        <Text type="secondary" className="text-base">
          Find answers to commonly asked questions, and submit requests to appropriate
          <br className="hidden md:block" />
          help teams as needed by choosing the service below:
        </Text>
      </div>

      {/* Support Options Card */}
      <Card className="border-2 border-gray-800 rounded-2xl overflow-hidden p-0!">
        {/* Main Support Team */}
        <div className="p-8 border-b-2 border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-600" />
            </div>
            <Title level={4} className="mb-2!">PackMyCode Market Support Team</Title>
            <Text type="secondary" className="block mb-4">
              Visit PackMyCode{' '}
              <Link href="/help" className="text-primary font-semibold underline">
                Help Center
              </Link>
            </Text>
            <Text className="block mb-5 text-gray-600">
              Need assistance from the Market support team. Please provide contact details or next steps. Thanks!
            </Text>
            <Link href="/C2M-requests">
              <Button type="primary" size="large" className="rounded-full px-6 h-11 inline-flex items-center gap-2">
                Submit a ticket
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Secondary Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Support */}
          <div className="p-6 md:p-8 md:border-r border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <Title level={5} className="mb-1!">Product Support Help Center</Title>
                <Text type="secondary" className="text-sm block mb-3">
                  Visit PackMyCode{' '}
                  <Link href="/help" className="text-primary font-semibold underline">
                    Help Center
                  </Link>
                </Text>
                <Text className="text-sm text-gray-600 block mb-4">
                  Need help? Get help from the community. If you're on a paid plan, submit a ticket to our expert support team for quick solutions.
                </Text>
                <Link href="/C2SM-requests">
                  <Button type="primary" className="rounded-full inline-flex items-center gap-2">
                    Submit a ticket
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Seller Support */}
          <div className="p-6 md:p-8 border-t md:border-t-0 border-gray-200">
            <div className="flex items-start gap-4 md:flex-row-reverse md:text-right">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Headset size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <Title level={5} className="mb-1!">Seller Support Help Center</Title>
                <Text type="secondary" className="text-sm block mb-3">
                  Visit PackMyCode{' '}
                  <Link href="/help" className="text-primary font-semibold underline">
                    Help Center
                  </Link>
                </Text>
                <Text className="text-sm text-gray-600 block mb-4">
                  Welcome to the PackMyCode Seller Help Center! Find guides, tips, and support to help you create and manage your code packages with ease.
                </Text>
                <Link href="/S2M-requests">
                  <Button type="primary" className="rounded-full inline-flex items-center gap-2">
                    Submit a ticket
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="flex justify-center gap-6 mt-6 flex-wrap">
        <Link href="/support-requests" className="text-sm text-primary font-medium hover:underline">
          View My Support Requests
        </Link>
        <Link href="/help" className="text-sm text-primary font-medium hover:underline">
          Browse Help Articles
        </Link>
      </div>
    </div>
  );
}
