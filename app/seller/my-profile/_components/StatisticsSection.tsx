'use client';

import { ReactNode } from 'react';

interface Statistic {
  icon: ReactNode;
  label: string;
  value: string | number;
}

interface StatisticsSectionProps {
  title: string;
  statistics: Statistic[];
}

export default function StatisticsSection({
  title,
  statistics,
}: StatisticsSectionProps) {
  return (
    <div className="mb-6 border-b border-gray-200 pb-6">
      <h5 className="text-lg font-semibold text-gray-900 mb-4">{title}</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-sm transition-shadow"
          >
            <div className="mb-3 text-primary flex justify-center">{stat.icon}</div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <h4 className="text-base font-semibold text-gray-900">{stat.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
