'use client';

import { Progress } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProgressItem {
  label: string;
  value: string | number;
  percentage: number;
  color?: string;
}

interface EarningsProps {
  title: string;
  amount: string;
  percentageChange?: string;
  percentageChangeLabel?: string;
  isIncrease?: boolean;
  isShowCompareProgress?: boolean;
  progressItems: ProgressItem[];
}

export default function Earnings({
  title,
  amount,
  percentageChange,
  percentageChangeLabel,
  isIncrease = true,
  isShowCompareProgress = false,
  progressItems,
}: EarningsProps) {
  const getProgressColor = (index: number) => {
    const colors = ['#3b82f6', '#22c55e', '#eab308'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col w-full">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {title}
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{amount}</h2>
            {isShowCompareProgress && percentageChange && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    isIncrease
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isIncrease ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {percentageChange}
                </span>
                <span className="text-xs text-gray-500">{percentageChangeLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {progressItems.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <h5 className="text-lg font-semibold text-gray-900 mb-2">{item.value}</h5>
            <Progress
              percent={item.percentage}
              showInfo={false}
              strokeColor={item.color || getProgressColor(index)}
              trailColor="#e5e7eb"
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
