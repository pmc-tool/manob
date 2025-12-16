// MIGRATION: Support Requests page from manob.ai
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Empty, Tag, Table, Select } from 'antd';
import { PlusOutlined, EyeOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Headset } from 'lucide-react';
import styles from './page.module.css';

// MOCK: Support ticket interface
interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  supportCenter: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'solved';
}

// MOCK: Sample support tickets
const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    category: 'Order Issue',
    subject: 'Order not delivered',
    priority: 'high',
    supportCenter: 'PMC',
    createdAt: '2024-12-10T10:30:00Z',
    status: 'in_progress',
  },
  {
    id: '2',
    category: 'Payment Problem',
    subject: 'Refund not received',
    priority: 'medium',
    supportCenter: 'PMC',
    createdAt: '2024-12-08T14:20:00Z',
    status: 'pending',
  },
  {
    id: '3',
    category: 'Technical Support',
    subject: 'Unable to download product',
    priority: 'low',
    supportCenter: 'Seller',
    createdAt: '2024-12-05T09:15:00Z',
    status: 'solved',
  },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'solved', label: 'Solved' },
];

const SUPPORT_CENTER_OPTIONS = [
  { value: 'all', label: 'All Support Centers' },
  { value: 'pmc', label: 'PMC Support Center' },
  { value: 'seller', label: 'Seller Support Center' },
  { value: 'product', label: 'Product Support Center' },
];

export default function SupportRequestsPage() {
  const [tickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [statusFilter, setStatusFilter] = useState('all');
  const [centerFilter, setCenterFilter] = useState('all');

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const centerMatch = centerFilter === 'all' || ticket.supportCenter.toLowerCase() === centerFilter;
    return statusMatch && centerMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in_progress':
        return 'blue';
      case 'solved':
        return 'green';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
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
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)} className="capitalize">
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Support Center',
      dataIndex: 'supportCenter',
      key: 'supportCenter',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <div className="font-medium">{formatDate(date)}</div>
          <div className="text-gray-500 text-xs">{formatTime(date)}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
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
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Link>
      ),
    },
  ];

  // Show empty state if no tickets at all
  if (tickets.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Headset size={64} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No Support Requests</h3>
          <p className={styles.emptyText}>
            You haven't created any support requests yet.
            <br />
            Need help? Create a new ticket and we'll get back to you.
          </p>
          <Link href="/support-contact">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Create Support Ticket
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <CustomerServiceOutlined className={styles.headerIcon} />
          <h1 className={styles.title}>Support Requests</h1>
        </div>

        <div className={styles.headerRight}>
          <Select
            value={centerFilter}
            onChange={setCenterFilter}
            style={{ width: 180 }}
            options={SUPPORT_CENTER_OPTIONS}
          />

          <div className={styles.statusFilters}>
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`${styles.statusBtn} ${statusFilter === filter.id ? styles.active : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <Link href="/support-contact">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card className={styles.tableCard}>
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
            }}
          />
        )}
      </Card>
    </div>
  );
}
