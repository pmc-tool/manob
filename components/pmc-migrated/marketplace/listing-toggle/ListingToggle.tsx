// MIGRATION: Toggle component for switching between Products and Services
'use client';

import { Package, Briefcase } from 'lucide-react';

export type ListingType = 'products' | 'services';

interface ListingToggleProps {
  activeType: ListingType;
  onToggle: (type: ListingType) => void;
}

export default function ListingToggle({ activeType, onToggle }: ListingToggleProps) {
  return (
    <div className="inline-flex relative bg-gray-100 rounded-xl p-1">
      <button
        className={`relative z-[2] flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-transparent border-none rounded-lg cursor-pointer min-w-[120px] transition-colors ${
          activeType === 'products' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onToggle('products')}
      >
        <Package size={18} />
        <span className="hidden sm:inline">Products</span>
      </button>
      <button
        className={`relative z-[2] flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-transparent border-none rounded-lg cursor-pointer min-w-[120px] transition-colors ${
          activeType === 'services' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onToggle('services')}
      >
        <Briefcase size={18} />
        <span className="hidden sm:inline">Services</span>
      </button>
      <div
        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out z-[1]"
        style={{
          transform: activeType === 'services' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
    </div>
  );
}
