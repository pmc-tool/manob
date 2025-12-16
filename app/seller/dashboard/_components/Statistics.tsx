'use client';

import { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useGetDashboardChartDataQuery } from '@/state/services/seller-service/dashboard.service';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StatisticsProps {
  earningToDate: number;
}

export default function Statistics({ earningToDate }: StatisticsProps) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dayArray, setDayArray] = useState<string[]>([]);

  const selectedMonth = selectedDate.month() + 1;
  const selectedYear = selectedDate.year();

  const { data: chartData } = useGetDashboardChartDataQuery({
    month: selectedMonth,
    year: selectedYear,
  });

  useEffect(() => {
    const daysInMonth = selectedDate.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    setDayArray(days);
  }, [selectedDate]);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: dayArray,
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
        formatter: (value) => `$${value}`,
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
    colors: ['#3b82f6'],
  };

  const chartSeries = [
    {
      name: 'Earnings',
      data: chartData || Array(dayArray.length).fill(0),
    },
  ];

  return (
    <div className="mt-8 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={24} className="text-primary flex-shrink-0" />
          <div>
            <h5 className="text-lg font-semibold text-gray-900">
              Service & Sales Overview Statistics
            </h5>
            <p className="text-sm text-gray-500">
              View your service sales and commissions over time
            </p>
          </div>
        </div>
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          format="MMMM YYYY"
          allowClear={false}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 relative">
        {/* Overlay Info */}
        <div className="hidden md:block absolute left-6 top-6 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            Earnings to date: ${earningToDate.toLocaleString()}
          </h4>
          <Link
            href="/seller/finance"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Earnings
          </Link>
        </div>

        {/* Chart */}
        <div className="min-h-[350px]">
          {typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          )}
        </div>

        {/* Mobile Info */}
        <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Earnings to date: ${earningToDate.toLocaleString()}
          </h4>
          <Link
            href="/seller/finance"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Earnings
          </Link>
        </div>
      </div>
    </div>
  );
}
