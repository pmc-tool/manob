// Support Requests List Page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Empty, Tag, Table, Select, Typography } from 'antd';
import { Plus, Eye, Headset } from 'lucide-react';

const { Title, Text } = Typography;

// Mock Support ticket interface
interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  priority: 'LOW' | 'REGULAR' | 'IMPORTANT' | 'URGENT';
  supportCenter: string;
  createdAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SOLVED';
}

// Mock Sample support tickets
const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    category: 'Download Issue',
    subject: 'Unable to download purchased product',
    priority: 'IMPORTANT',
    supportCenter: 'PRODUCT-SUPPORT-CENTER',
    createdAt: '2024-12-15T10:30:00Z',
    status: 'IN_PROGRESS',
  },
  {
    id: '2',
    category: 'Payment Problem',
    subject: 'Refund not received after 7 days',
    priority: 'URGENT',
    supportCenter: 'PMC-SUPPORT-CENTER',
    createdAt: '2024-12-12T14:20:00Z',
    status: 'PENDING',
  },
  {
    id: '3',
    category: 'License Question',
    subject: 'Need help understanding license terms',
    priority: 'LOW',
    supportCenter: 'PMC-SUPPORT-CENTER',
    createdAt: '2024-12-10T09:15:00Z',
    status: 'SOLVED',
  },
  {
    id: '4',
    category: 'Seller Account',
    subject: 'Verification documents not accepted',
    priority: 'REGULAR',
    supportCenter: 'SELLER-SUPPORT-CENTER',
    createdAt: '2024-12-08T16:45:00Z',
    status: 'IN_PROGRESS',
  },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'SOLVED', label: 'Solved' },
];

const SUPPORT_CENTER_OPTIONS = [
  { value: 'all', label: 'All Support Centers' },
  { value: 'PMC-SUPPORT-CENTER', label: 'PMC Support' },
  { value: 'SELLER-SUPPORT-CENTER', label: 'Seller Support' },
  { value: 'PRODUCT-SUPPORT-CENTER', label: 'Product Support' },
];

export default function SupportRequestsPage() {
  const [tickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [statusFilter, setStatusFilter] = useState('all');
  const [centerFilter, setCenterFilter] = useState('all');

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const centerMatch = centerFilter === 'all' || ticket.supportCenter === centerFilter;
    return statusMatch && centerMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'IN_PROGRESS':
        return 'processing';
      case 'SOLVED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'red';
      case 'IMPORTANT':
        return 'orange';
      case 'REGULAR':
        return 'blue';
      case 'LOW':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSupportCenterLabel = (center: string) => {
    if (center === 'PRODUCT-SUPPORT-CENTER') return 'Product';
    if (center === 'SELLER-SUPPORT-CENTER') return 'Seller';
    return 'PMC';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      title: 'S/N',
      key: 'sn',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <span className="font-medium">{category}</span>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <span className="text-gray-700 line-clamp-1">{subject}</span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Support Center',
      dataIndex: 'supportCenter',
      key: 'supportCenter',
      width: 120,
      render: (center: string) => (
        <Tag>{getSupportCenterLabel(center)}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date: string) => (
        <div>
          <div className="font-medium text-sm">{formatDate(date)}</div>
          <div className="text-gray-500 text-xs">{formatTime(date)}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: unknown, record: SupportTicket) => (
        <Link href={`/my-support/${record.id}`}>
          <Button type="text" icon={<Eye size={16} />} size="small" />
        </Link>
      ),
    },
  ];

  // Show empty state if no tickets at all
  if (tickets.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Headset size={40} className="text-gray-400" />
        </div>
        <Title level={3} className="mb-2!">No Support Requests</Title>
        <Text type="secondary" className="block mb-6">
          You haven't created any support requests yet.
          <br />
          Need help? Create a new ticket and we'll get back to you.
        </Text>
        <Link href="/support-contact">
          <Button type="primary" icon={<Plus size={16} />} size="large">
            Create Support Ticket
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Headset size={20} className="text-gray-600" />
          </div>
          <div>
            <Title level={4} className="mb-0!">Support Requests</Title>
            <Text type="secondary" className="text-sm">{tickets.length} total tickets</Text>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={centerFilter}
            onChange={setCenterFilter}
            style={{ width: 180 }}
            options={SUPPORT_CENTER_OPTIONS}
          />

          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === filter.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <Link href="/support-contact">
            <Button type="primary" icon={<Plus size={16} />}>
              Create Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        {filteredTickets.length === 0 ? (
          <Empty description="No support requests found for the selected filters" />
        ) : (
          <Table
            dataSource={filteredTickets}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} tickets`,
            }}
          />
        )}
      </Card>
    </div>
  );
}
