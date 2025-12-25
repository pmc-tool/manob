'use client';

interface TotalBoxProps {
  data: any;
}

export default function TotalBox({ data }: TotalBoxProps) {
  const totalBoxData = [
    {
      title: 'Product Sell',
      amount: data?.total_product_sales || 0,
      currency: '$',
      currencyName: 'USD',
    },
    {
      title: 'Service Sell',
      amount: data?.total_service_sales || 0,
      currency: '$',
      currencyName: 'USD',
    },
    {
      title: 'Active Orders',
      amount: data?.total_active_orders || 0,
    },
    {
      title: 'Cancel Orders',
      amount: data?.total_canceled_orders || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {totalBoxData.map((item, index) => (
          <div
            key={index}
            className={`${
              index < totalBoxData.length - 1
                ? 'lg:border-r lg:border-gray-200 lg:pr-6'
                : ''
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {item.title}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {item.currency && item.currency}
              {item.amount}
              {item.currencyName && (
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ({item.currencyName})
                </span>
              )}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
