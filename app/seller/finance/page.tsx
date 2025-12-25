"use client";

import { Card, Table, Tag, Button, Select, DatePicker, Empty, Skeleton, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Clock,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Filter,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import {
  useGetWalletInfoQuery,
  useGetFinanceInfoQuery,
  useGetMyTransactionsQuery,
} from "@/state/services/seller-service/finance.service";
import WithdrawModal from "./_components/WithdrawModal";

const { RangePicker } = DatePicker;

// Mock data for development
const mockWalletData = {
  available_balance: 2450.00,
  currency: "USD",
  withdrawn_to_date: 5200.00,
};

const mockFinanceData = {
  payments_cleared: 350.00,
  payments_active_orders: 180.00,
  earnings_to_date: 7650.00,
  expenses_to_date: 120.00,
  theme_sales: 5400.00,
  service_sales: 2250.00,
};

const mockTransactions = {
  items: [
    {
      id: "1",
      tnx_id: "TXN-2024-001",
      action_type: "PRODUCT_SALE",
      details: "Theme Purchase - Modern Dashboard",
      created_at: "2024-12-15T10:30:00Z",
      amount: 49.00,
      type: "CREDIT",
      status: "SUCCESS",
    },
    {
      id: "2",
      tnx_id: "TXN-2024-002",
      action_type: "SERVICE_SALE",
      details: "Service Order - Logo Design",
      created_at: "2024-12-14T15:45:00Z",
      amount: 150.00,
      type: "CREDIT",
      status: "SUCCESS",
    },
    {
      id: "3",
      tnx_id: "TXN-2024-003",
      action_type: "WITHDRAWAL",
      details: "Withdrawal to Bank Account",
      created_at: "2024-12-13T09:00:00Z",
      amount: 500.00,
      type: "DEBIT",
      status: "PENDING",
    },
    {
      id: "4",
      tnx_id: "TXN-2024-004",
      action_type: "PRODUCT_SALE",
      details: "Theme Purchase - E-commerce Template",
      created_at: "2024-12-12T14:20:00Z",
      amount: 79.00,
      type: "CREDIT",
      status: "SUCCESS",
    },
    {
      id: "5",
      tnx_id: "TXN-2024-005",
      action_type: "REFUND",
      details: "Refund - Customer Request",
      created_at: "2024-12-11T11:15:00Z",
      amount: 49.00,
      type: "DEBIT",
      status: "SUCCESS",
    },
  ],
  meta: {
    total: 25,
    page: 1,
    limit: 10,
    totalPages: 3,
  },
};

interface Transaction {
  id: string;
  tnx_id: string;
  action_type: string;
  details: string;
  created_at: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export default function SellerFinancePage() {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build query params
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", pageSize.toString());
    if (statusFilter) params.append("status", statusFilter);
    if (dateRange?.[0]) params.append("start_date", dateRange[0].format("YYYY-MM-DD"));
    if (dateRange?.[1]) params.append("end_date", dateRange[1].format("YYYY-MM-DD"));
    return `?${params.toString()}`;
  };

  // API queries
  const { data: walletData, isLoading: walletLoading } = useGetWalletInfoQuery();
  const { data: financeData, isLoading: financeLoading } = useGetFinanceInfoQuery();
  const { data: transactionsData, isLoading: transactionsLoading, refetch } = useGetMyTransactionsQuery(buildQueryParams());

  // Use mock data if API returns no data
  const wallet = walletData || mockWalletData;
  const finance = financeData || mockFinanceData;
  const transactions = transactionsData || mockTransactions;

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      SUCCESS: { color: "success", text: "Completed" },
      PENDING: { color: "warning", text: "Pending" },
      FAILED: { color: "error", text: "Failed" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PRODUCT_SALE: "Product Sale",
      SERVICE_SALE: "Service Sale",
      WITHDRAWAL: "Withdrawal",
      REFUND: "Refund",
      DEPOSIT: "Deposit",
      FEE: "Platform Fee",
    };
    return labels[type] || type;
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Transaction ID",
      dataIndex: "tnx_id",
      key: "tnx_id",
      render: (id) => <span className="font-mono text-sm">{id}</span>,
    },
    {
      title: "Type",
      dataIndex: "action_type",
      key: "action_type",
      render: (type) => (
        <span className="text-sm text-gray-600">{getActionTypeLabel(type)}</span>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details) => (
        <span className="text-sm text-gray-700 max-w-xs truncate block">{details}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-sm text-gray-600">
          {dayjs(date).format("MMM DD, YYYY")}
          <br />
          <span className="text-xs text-gray-400">{dayjs(date).format("hh:mm A")}</span>
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <div className="flex items-center gap-1">
          {record.type === "CREDIT" ? (
            <ArrowUpRight size={16} className="text-gray-500" />
          ) : (
            <ArrowDownRight size={16} className="text-gray-500" />
          )}
          <span className="font-semibold text-gray-700">
            {record.type === "CREDIT" ? "+" : "-"}${amount.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Tooltip title="Download Invoice">
          <Button type="text" size="small" icon={<Download size={16} />} />
        </Tooltip>
      ),
    },
  ];

  const isLoading = walletLoading || financeLoading;

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <DollarSign size={24} className="text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
              <p className="text-gray-500">Manage your earnings and payments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/seller/payment">
              <Button icon={<CreditCard size={16} />}>Payment Methods</Button>
            </Link>
            <Button
              type="primary"
              icon={<Wallet size={16} />}
              onClick={() => setWithdrawModalOpen(true)}
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Available Funds */}
            <Card className="border-gray-200 bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Funds</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${wallet.available_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Withdrawn to date: <span className="font-medium">${wallet.withdrawn_to_date?.toLocaleString() || "0"}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Wallet size={24} className="text-gray-600" />
                </div>
              </div>
              <Button
                type="primary"
                className="mt-4"
                block
                onClick={() => setWithdrawModalOpen(true)}
              >
                Withdraw Funds
              </Button>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Payments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${((finance.payments_cleared || 0) + (finance.payments_active_orders || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Clock size={24} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payments Being Cleared</span>
                  <span className="font-medium">${finance.payments_cleared?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Active Orders</span>
                  <span className="font-medium">${finance.payments_active_orders?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </Card>

            {/* Earnings & Expenses */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Earnings to Date</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${finance.earnings_to_date?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <TrendingUp size={24} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Product Sales</span>
                  <span className="font-medium">+${finance.theme_sales?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Service Sales</span>
                  <span className="font-medium">+${finance.service_sales?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Expenses</span>
                  <span className="font-medium">-${finance.expenses_to_date?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Transaction History */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              <span>Transaction History</span>
            </div>
          }
          extra={
            <div className="flex items-center gap-2">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 150 }}
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "SUCCESS", label: "Completed" },
                  { value: "PENDING", label: "Pending" },
                  { value: "FAILED", label: "Failed" },
                ]}
              />
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                placeholder={["Start Date", "End Date"]}
              />
              <Tooltip title="Refresh">
                <Button icon={<RefreshCw size={16} />} onClick={() => refetch()} />
              </Tooltip>
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={transactions.items}
            rowKey="id"
            loading={transactionsLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: transactions.meta?.total || 0,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} transactions`,
              onChange: (page) => setCurrentPage(page),
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No transactions found"
                />
              ),
            }}
          />
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link href="/seller/payment">
            <Card hoverable className="text-center cursor-pointer">
              <CreditCard size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-gray-500">Manage your payout methods</p>
            </Card>
          </Link>
          <Link href="/seller/tax-info">
            <Card hoverable className="text-center cursor-pointer">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">Tax Information</p>
              <p className="text-sm text-gray-500">View and update tax details</p>
            </Card>
          </Link>
          <Link href="/support-contact">
            <Card hoverable className="text-center cursor-pointer">
              <DollarSign size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="font-medium">Payment Support</p>
              <p className="text-sm text-gray-500">Get help with payments</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        availableBalance={wallet.available_balance || 0}
        currency={wallet.currency}
      />
    </section>
  );
}
