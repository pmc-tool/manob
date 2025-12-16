'use client';

import { useEffect, useState } from 'react';
import { Alert, Select, Spin } from 'antd';
import {
  Bell,
  CalendarPlus,
  AlertTriangle,
  Info,
  Plus,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/state/hooks';
import { useGetNewEventsQuery } from '@/state/services/event/event.service';
import { useGetDashboardDataQuery } from '@/state/services/seller-service/dashboard.service';
import Earnings from './_components/Earnings';
import Statistics from './_components/Statistics';
import TotalBox from './_components/TotalBox';
import ProfileCard from './_components/ProfileCard';

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | undefined>();

  const userInfo: any = useAppSelector((state) => state.auth.userInfo);
  const isLoginUser =
    typeof window !== 'undefined' ? localStorage.getItem('p_aut') : null;

  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();
  const { data: allSellerEvents } = useGetNewEventsQuery();

  const [progressItems, setProgressItems] = useState<any[]>([]);

  useEffect(() => {
    if (dashboardData) {
      setProgressItems([
        {
          label: 'Response Rate',
          value: `${dashboardData?.response_rate || 0}%`,
          percentage: dashboardData?.response_rate || 0,
          color: '#3b82f6',
        },
        {
          label: 'On-time Delivery',
          value: `${dashboardData?.total_on_time_delivery || 0}%`,
          percentage: dashboardData?.total_on_time_delivery || 0,
          color: '#22c55e',
        },
        {
          label: 'Order Completion Rate',
          value: `${dashboardData?.total_completed_orders || 0}%`,
          percentage: dashboardData?.total_completed_orders || 0,
          color: '#eab308',
        },
      ]);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (!isLoginUser) {
      router.push('/');
    }
  }, [isLoginUser, router]);

  const getAvatarUrl = (profileImage: string | undefined): string => {
    if (!profileImage) return '';
    if (profileImage.includes('https')) return profileImage;
    return `${process.env.NEXT_PUBLIC_S3_BUCKET}/${profileImage}`;
  };

  const handleUploadSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNextClick = () => {
    if (selectedOption === 'product') {
      router.push('/seller/product-add');
    } else if (selectedOption === 'service') {
      router.push('/seller/service-add');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-9">
            {/* Event Alerts */}
            {allSellerEvents?.items?.map((item: any) => (
              <Alert
                key={item.id}
                type="info"
                className="mb-4"
                showIcon
                icon={<Bell className="w-5 h-5" />}
                message={
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-medium">{item?.title}</span>
                    <Link
                      href={`/seller/event-add-items/${item?.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                      Add Your Item
                    </Link>
                  </div>
                }
              />
            ))}

            {/* Refund Request Alert */}
            {dashboardData?.total_refund_request > 0 && (
              <Alert
                type="warning"
                className="mb-4"
                showIcon
                icon={<Info className="w-5 h-5" />}
                message={
                  <div>
                    <span className="font-medium">Refund Requests: </span>
                    You have{' '}
                    <strong>{dashboardData?.total_refund_request} open refund requests</strong>{' '}
                    to action.{' '}
                    <Link
                      href="/seller/refund-list"
                      className="text-primary font-medium underline"
                    >
                      Review Refund Requests
                    </Link>
                  </div>
                }
              />
            )}

            {/* Hidden Items Alert */}
            {dashboardData?.item_logs?.total_hidden_items > 0 && (
              <Alert
                type="warning"
                className="mb-4"
                showIcon
                icon={<AlertTriangle className="w-5 h-5" />}
                message={
                  <div>
                    <span className="font-medium">Hidden Items: </span>
                    Some items are currently hidden and need review.{' '}
                    <Link
                      href="/seller/hidden-items"
                      className="text-primary font-medium underline"
                    >
                      Submit files to review
                    </Link>
                  </div>
                }
              />
            )}

            {/* Connect Buy Alert */}
            {dashboardData?.total_connections === 0 && (
              <Alert
                type="success"
                className="mb-4"
                showIcon
                icon={<CalendarPlus className="w-5 h-5" />}
                message={
                  <div>
                    <span className="font-medium">Buy connects for bid jobs: </span>
                    {dashboardData?.total_connect || 0} Bid Connections Available.{' '}
                    <Link
                      href="/connect"
                      className="text-primary font-medium underline"
                    >
                      Buy Connection
                    </Link>
                  </div>
                }
              />
            )}

            {/* Earnings + Payments Card Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
              <div className="xl:col-span-9">
                <Earnings
                  title="Net Earnings"
                  amount={`$${dashboardData?.total_net_earning || 0}`}
                  isShowCompareProgress={false}
                  progressItems={progressItems}
                />
              </div>
              <div className="xl:col-span-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                  <Image
                    src="/images/credit_card_payments.svg"
                    alt="Payments"
                    width={140}
                    height={100}
                    className="mb-4"
                  />
                  <Link
                    href="/seller/payment"
                    className="w-full px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
                  >
                    Payments
                  </Link>
                </div>
              </div>
            </div>

            {/* Total Box */}
            <TotalBox data={dashboardData} />

            {/* Statistics Chart */}
            <Statistics earningToDate={dashboardData?.total_net_earning || 0} />
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-3">
            {/* Profile Card */}
            <ProfileCard
              profileImage={getAvatarUrl(userInfo?.profile_image)}
              name={`${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim() || 'User'}
              rating={userInfo?.avg_rating || 0}
              sellerLevel={userInfo?.seller_info?.seller_level || 'N/A'}
              memberSince={formatDate(userInfo?.member_since)}
              responseTime={userInfo?.last_active || 'N/A'}
              profileLink="/seller/my-profile"
            />

            {/* Upload Item Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <h6 className="text-lg font-semibold text-gray-900 mb-3">Upload an item</h6>
              <div className="flex gap-2">
                <Select
                  placeholder="Select One"
                  className="flex-grow"
                  onChange={handleUploadSelect}
                  value={selectedOption}
                  options={[
                    { value: 'product', label: 'Upload Theme' },
                    { value: 'service', label: 'Create Service' },
                  ]}
                />
                <button
                  onClick={handleNextClick}
                  disabled={!selectedOption}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    selectedOption
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                How to upload your items to Packmycode?{' '}
                <Link href="#" className="text-primary font-medium">
                  Read more
                </Link>
              </p>
            </div>

            {/* This Week's Stats */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h6 className="text-lg font-semibold text-gray-900 mb-3">This week's stats</h6>
              <p className="text-sm text-gray-600 mb-1">
                You have earned{' '}
                <strong className="text-gray-900">
                  ${dashboardData?.weekly_earn_amounts || 0}
                </strong>
              </p>
              <p className="text-sm text-gray-600">
                You have sold{' '}
                <strong className="text-gray-900">
                  {dashboardData?.product_weekly_total_sales || 0}
                </strong>{' '}
                items
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
