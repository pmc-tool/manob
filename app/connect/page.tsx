// Connect History Page - Balance and Purchase History
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Table, Typography, Empty, Tooltip } from 'antd';
import { Zap, ShoppingBag, Download, ArrowRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

const { Title, Text } = Typography;

// Mock data - replace with API
const mockConnectInfo = {
  available_connect: 150,
};

const mockPurchaseList = [
  {
    id: '1',
    order_id: 'ORD-001',
    total_payable: 49.99,
    subscription_meta: { connect_count: 100, validity: 30 },
    created_at: '2024-12-10T10:30:00Z',
  },
  {
    id: '2',
    order_id: 'ORD-002',
    total_payable: 29.99,
    subscription_meta: { connect_count: 50, validity: 30 },
    created_at: '2024-11-15T14:20:00Z',
  },
  {
    id: '3',
    order_id: 'ORD-003',
    total_payable: 99.99,
    subscription_meta: { connect_count: 250, validity: 60 },
    created_at: '2024-10-20T09:15:00Z',
  },
];

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy');
};

const getExpiryDate = (dateString: string, validityDays: number) => {
  const startDate = new Date(dateString);
  const expiryDate = addDays(startDate, validityDays);
  return format(expiryDate, 'dd MMM yyyy');
};

export default function ConnectPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock API data - replace with actual hooks
  const connectInfo = mockConnectInfo;
  const purchaseList = mockPurchaseList;

  const handleDownload = (orderId: string) => {
    // Mock download - implement actual PDF generation
    console.log('Downloading receipt for order:', orderId);
  };

  const columns = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Price',
      dataIndex: 'total_payable',
      key: 'price',
      render: (price: number) => <span className="font-medium">${price}</span>,
    },
    {
      title: 'Connects',
      key: 'connects',
      render: (_: unknown, record: typeof mockPurchaseList[0]) => (
        <span className="font-medium">{record.subscription_meta.connect_count}</span>
      ),
    },
    {
      title: 'Buy/Start Date',
      dataIndex: 'created_at',
      key: 'startDate',
      render: (date: string) => <span className="font-medium">{formatDate(date)}</span>,
    },
    {
      title: 'Ends In',
      key: 'endsIn',
      render: (_: unknown, record: typeof mockPurchaseList[0]) => (
        <span className="font-medium">
          {getExpiryDate(record.created_at, record.subscription_meta.validity)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: typeof mockPurchaseList[0]) => (
        <Tooltip title="Download Receipt">
          <Button
            type="text"
            icon={<Download size={16} />}
            onClick={() => handleDownload(record.order_id)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <Title level={3} className="mb-6!">Connect History</Title>

      {/* My Connect Section */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <Zap size={20} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <Title level={5} className="mb-1!">My Connect</Title>
          <Text type="secondary">
            My Connect is your personalized hub for managing purchases, subscriptions, and platform interactions seamlessly.
          </Text>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <Text type="secondary" className="text-sm">Connects remaining</Text>
            <div className="text-4xl font-bold text-gray-900 mt-1">
              {connectInfo.available_connect}
            </div>
          </div>
          <Link href="/connect-payment">
            <Button type="primary" size="large" className="inline-flex items-center gap-2">
              Buy Connects
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Purchases Section */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <ShoppingBag size={20} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <Title level={5} className="mb-1!">Recent Purchases</Title>
          <Text type="secondary">
            Recent Connect Purchases provide insights into your latest transactions and acquired services on the platform.
          </Text>
        </div>
      </div>

      {/* Purchases Table */}
      <Card className="shadow-sm">
        {purchaseList.length === 0 ? (
          <Empty
            description="No purchase history found"
            className="py-12"
          >
            <Link href="/connect-payment">
              <Button type="primary">Buy Your First Connects</Button>
            </Link>
          </Empty>
        ) : (
          <Table
            dataSource={purchaseList}
            columns={columns}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: purchaseList.length,
              onChange: setCurrentPage,
              showSizeChanger: false,
            }}
          />
        )}
      </Card>
    </div>
  );
}
