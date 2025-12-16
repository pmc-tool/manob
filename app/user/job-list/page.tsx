"use client";
import { Table, Select, Button, Tag, Tooltip, Drawer, Skeleton, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteJobByIdMutation,
  useGetMyJobsQuery,
} from "@/state/services/user-service/jobs.service";
import { dateTimeFormat } from "@/utils/dateFormat";

const typeOptions = [
  { value: "ALL", label: "All Types" },
  { value: "LIVE", label: "Live Job" },
  { value: "REGULAR", label: "Regular Job" },
];

const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ON_REVIEW", label: "On Review" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "green";
    case "ON_REVIEW":
      return "orange";
    case "HIRED":
      return "blue";
    case "REJECTED":
      return "red";
    case "DRAFT":
      return "default";
    default:
      return "default";
  }
};

const getJobTypeColor = (type: string) => {
  return type === "LIVE" ? "magenta" : "cyan";
};

const formatStatus = (status: string) => {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function UserJobList() {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);

  const {
    data: list,
    isLoading,
    error,
  } = useGetMyJobsQuery({
    query: {
      page: currentPage,
      limit: 10,
      type: selectedType,
      status: selectedStatus,
    },
  });

  const jobItems = list?.items || [];
  const pagination = list?.pagination;

  const [deleteJob, { data: jobDeletedData }] = useDeleteJobByIdMutation();

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteJob = async (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "If you confirm, the job will be deleted. This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteJob(id);
      },
    });
  };

  const handleViewJob = (job: any) => {
    setActiveJob(job);
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (jobDeletedData?.statusCode === 200 || jobDeletedData?.statusCode === 201) {
      toast.success("Job deleted successfully!");
    } else if (jobDeletedData?.statusCode === 400 || jobDeletedData?.statusCode === 404) {
      toast.error(jobDeletedData?.message || "Failed to delete job!");
    }
  }, [jobDeletedData]);

  const columns: ColumnsType<any> = [
    {
      title: "S/N",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <Link href={`/job-details/${record?.slug}`} className="font-medium text-gray-900 hover:text-primary">
            {text}
          </Link>
          <div className="text-sm text-gray-500 line-clamp-1 mt-1">
            {record?.description?.substring(0, 80)}...
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "job_type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={getJobTypeColor(type)}>{type}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "service_price",
      key: "price",
      width: 100,
      render: (price) => <span className="font-medium">${price}</span>,
    },
    {
      title: "Delivery",
      key: "delivery",
      width: 120,
      render: (_, record) => (
        <span>{record?.delivery_time} {record?.delivery_time_type}</span>
      ),
    },
    {
      title: "Bids",
      dataIndex: "total_bids",
      key: "bids",
      width: 80,
      render: (bids) => <span className="font-medium">{bids || 0}</span>,
    },
    {
      title: "Posted",
      dataIndex: "updated_at",
      key: "posted",
      width: 140,
      render: (date) => <span className="text-sm text-gray-500">{dateTimeFormat(date)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<Eye size={14} />}
              onClick={() => handleViewJob(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              icon={<Trash2 size={14} />}
              onClick={() => handleDeleteJob(record?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (jobItems.length === 0 && !isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium mb-2">
              Discover the #1 job board to hire experts or
              <br className="hidden md:block" /> get hired for any job, any time.
            </h2>
            <p className="text-gray-500 mb-4">
              The #1 job board to connect with experts or find your next opportunity.
            </p>
            <Link href="/user/job-post">
              <Button type="primary" icon={<Plus size={16} />} size="large" className="rounded-full">
                Post a job
              </Button>
            </Link>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <Image
              src="/images/empty-icon/job.svg"
              alt="Not Found"
              width={150}
              height={150}
              className="mx-auto"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">No Jobs Posted Yet</h3>
              <p className="text-gray-500 mt-1">
                It looks like you haven't posted any jobs at the moment.
                <br className="hidden sm:block" /> Create your first job posting to get started!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-2">
            Discover the #1 job board to hire experts or
            <br className="hidden md:block" /> get hired for any job, any time.
          </h2>
          <p className="text-gray-500 mb-4">
            The #1 job board to connect with experts or find your next opportunity.
          </p>
          <Link href="/user/job-post">
            <Button type="primary" icon={<Plus size={16} />} size="large" className="rounded-full">
              Post a job
            </Button>
          </Link>
        </div>

        {/* Filter Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">Jobs available</h1>
            <p className="text-gray-500 text-sm">{pagination?.total_count || 0} items</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              options={typeOptions}
              style={{ width: 130 }}
            />
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              options={statusOptions}
              style={{ width: 130 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            dataSource={jobItems}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              total: pagination?.total_count || 0,
              pageSize: 10,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} jobs`,
            }}
          />
        </div>

        {/* Job Details Drawer */}
        <Drawer
          title="Job Details"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={480}
        >
          {activeJob && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{activeJob.title}</h3>
                <div className="flex gap-2 mt-2">
                  <Tag color={getJobTypeColor(activeJob.job_type)}>{activeJob.job_type}</Tag>
                  <Tag color={getStatusColor(activeJob.status)}>{formatStatus(activeJob.status)}</Tag>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{activeJob.description}</p>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Budget</span>
                  <p className="font-medium">${activeJob.service_price}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Delivery Time</span>
                  <p className="font-medium">{activeJob.delivery_time} {activeJob.delivery_time_type}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Experience Level</span>
                  <p className="font-medium">{activeJob.experience_level || "Any"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Total Bids</span>
                  <p className="font-medium">{activeJob.total_bids || 0}</p>
                </div>
              </div>

              {activeJob.skills?.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeJob.skills.map((skill: string, idx: number) => (
                      <Tag key={idx}>{skill}</Tag>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <Link href={`/job-details/${activeJob.slug}`}>
                  <Button type="primary" block>
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </section>
  );
}
