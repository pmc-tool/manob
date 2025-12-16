"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  Table,
  Tag,
  Select,
  DatePicker,
  Empty,
  Skeleton,
  Dropdown,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  Gavel,
  Eye,
  Calendar,
  MoreVertical,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import dayjs from "dayjs";
import { useGetMyBidsQuery } from "@/state/services/seller-service/jobs.service";

const { RangePicker } = DatePicker;

// Mock data for development
const mockBidsData = {
  data: {
    items: [
      {
        id: "1",
        job_id: "job-001",
        job_title: "Build a React Dashboard Application",
        price: 500,
        status: "PENDING",
        created_at: "2024-12-15T10:30:00Z",
        service_meta: {
          user_meta: {
            first_name: "John",
            last_name: "Smith",
            profile_image: null,
          },
        },
      },
      {
        id: "2",
        job_id: "job-002",
        job_title: "Mobile App Development - iOS & Android",
        price: 1200,
        status: "ACCEPTED",
        created_at: "2024-12-14T14:20:00Z",
        service_meta: {
          user_meta: {
            first_name: "Sarah",
            last_name: "Johnson",
            profile_image: null,
          },
        },
      },
      {
        id: "3",
        job_id: "job-003",
        job_title: "E-commerce Website Redesign",
        price: 800,
        status: "REJECTED",
        created_at: "2024-12-13T09:15:00Z",
        service_meta: {
          user_meta: {
            first_name: "Mike",
            last_name: "Brown",
            profile_image: null,
          },
        },
      },
      {
        id: "4",
        job_id: "job-004",
        job_title: "WordPress Plugin Development",
        price: 350,
        status: "PENDING",
        created_at: "2024-12-12T16:45:00Z",
        service_meta: {
          user_meta: {
            first_name: "Emma",
            last_name: "Wilson",
            profile_image: null,
          },
        },
      },
      {
        id: "5",
        job_id: "job-005",
        job_title: "API Integration and Backend Development",
        price: 650,
        status: "ACCEPTED",
        created_at: "2024-12-11T11:00:00Z",
        service_meta: {
          user_meta: {
            first_name: "David",
            last_name: "Lee",
            profile_image: null,
          },
        },
      },
    ],
    pagination: {
      total_count: 15,
      current_page: 1,
      total_pages: 2,
      limit: 10,
    },
  },
};

const jobTypeOptions = [
  { value: "ALL", label: "All Types" },
  { value: "LIVE", label: "Live Job" },
  { value: "REGULAR", label: "Regular Job" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const getStatusConfig = (status: string) => {
  const config: Record<string, { color: string; label: string }> = {
    PENDING: { color: "warning", label: "Pending" },
    ACCEPTED: { color: "success", label: "Accepted" },
    REJECTED: { color: "error", label: "Rejected" },
    IN_PROGRESS: { color: "processing", label: "In Progress" },
    COMPLETED: { color: "success", label: "Completed" },
  };
  return config[status] || { color: "default", label: status };
};

interface BidItem {
  id: string;
  job_id: string;
  job_title: string;
  price: number;
  status: string;
  created_at: string;
  service_meta?: {
    user_meta?: {
      first_name: string;
      last_name: string;
      profile_image: string | null;
    };
  };
}

export default function SellerBidsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobType, setJobType] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");
    if (jobType !== "ALL") params.append("job_type", jobType);
    if (statusFilter) params.append("status", statusFilter);
    if (dateRange?.[0]) params.append("start_date", dateRange[0].format("YYYY-MM-DD"));
    if (dateRange?.[1]) params.append("end_date", dateRange[1].format("YYYY-MM-DD"));
    return `?${params.toString()}`;
  };

  const { data: bidsResponse, isLoading } = useGetMyBidsQuery(buildQueryString());

  // Use mock data if API returns no data
  const bidsData = bidsResponse?.data || mockBidsData.data;
  const bidsList: BidItem[] = bidsData?.items || [];
  const pagination = bidsData?.pagination;

  const getDropdownItems = (bid: BidItem): MenuProps["items"] => [
    {
      key: "view",
      label: (
        <Link href={`/job-details/${bid.job_id}`} className="flex items-center gap-2">
          <Eye size={14} />
          View Job
        </Link>
      ),
    },
    {
      key: "message",
      label: (
        <Link href={`/messages?job=${bid.job_id}`} className="flex items-center gap-2">
          <MessageSquare size={14} />
          Message Client
        </Link>
      ),
    },
  ];

  const columns: ColumnsType<BidItem> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span className="text-gray-500 text-sm">
          {(currentPage - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      title: "Client",
      key: "client",
      width: 180,
      render: (_, record) => {
        const user = record.service_meta?.user_meta;
        const fullName = user
          ? `${user.first_name} ${user.last_name}`
          : "Unknown Client";
        return (
          <div className="flex items-center gap-3">
            <Image
              src={
                user?.profile_image
                  ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${user.profile_image}`
                  : "/images/user-placeholder.jpg"
              }
              alt={fullName}
              width={36}
              height={36}
              className="rounded-full object-cover"
              unoptimized
            />
            <span className="font-medium text-gray-900 text-sm">{fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      render: (title, record) => (
        <Link
          href={`/job-details/${record.job_id}`}
          className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-1"
        >
          {title}
        </Link>
      ),
    },
    {
      title: "Bid Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => (
        <div>
          <div className="text-sm text-gray-900">
            {dayjs(date).format("MMM DD, YYYY")}
          </div>
          <div className="text-xs text-gray-400">
            {dayjs(date).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Bid Amount",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
        <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getDropdownItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" size="small" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];

  // Stats calculation
  const totalBids = pagination?.total_count || bidsList.length;
  const acceptedBids = bidsList.filter((b) => b.status === "ACCEPTED").length;
  const pendingBids = bidsList.filter((b) => b.status === "PENDING").length;

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Gavel size={24} className="text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
              <p className="text-gray-500 text-sm">{totalBids} total bids</p>
            </div>
          </div>
          <Link href="/jobs">
            <Button type="primary" icon={<ExternalLink size={16} />}>
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalBids}</p>
              <p className="text-sm text-gray-500">Total Bids</p>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{acceptedBids}</p>
              <p className="text-sm text-gray-500">Accepted</p>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{pendingBids}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Filters:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={jobType}
                onChange={setJobType}
                options={jobTypeOptions}
                style={{ width: 140 }}
                placeholder="Job Type"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                style={{ width: 140 }}
                placeholder="Status"
                allowClear
              />
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                placeholder={["Start Date", "End Date"]}
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </div>
          </div>
        </Card>

        {/* Bids Table */}
        <Card>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : bidsList.length > 0 ? (
            <Table
              columns={columns}
              dataSource={bidsList}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: pagination?.total_count || 0,
                showSizeChanger: false,
                showTotal: (total) => `${total} bids`,
                onChange: (page) => setCurrentPage(page),
              }}
              scroll={{ x: 800 }}
            />
          ) : (
            <Empty
              image={
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Gavel size={48} className="text-gray-400" />
                </div>
              }
              description={
                <div className="mt-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    No Bids Yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You haven't placed any bids yet. Browse available jobs and
                    start bidding to win projects.
                  </p>
                </div>
              }
            >
              <Link href="/jobs">
                <Button type="primary" size="large" className="mt-4">
                  Browse Available Jobs
                </Button>
              </Link>
            </Empty>
          )}
        </Card>
      </div>
    </section>
  );
}
