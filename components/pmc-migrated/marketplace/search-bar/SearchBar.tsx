// MIGRATION: PageHeaderSearch component from manob.ai
// Simplified version with Tailwind CSS
'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { SearchModal } from './SearchModal';

interface SearchBarProps {
  title?: string;
  description?: string;
  placeholder?: string;
  count?: string;
  infoText?: string;
}

export default function SearchBar({
  title,
  description,
  placeholder = 'Search products...',
  count = '10,000+',
  infoText = 'products available',
}: SearchBarProps) {
  const [showModal, setShowModal] = useState(false);

  const handleInputClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {title && <h4 className="text-[21px] font-semibold mb-1 capitalize">{title}</h4>}
      {description && <p className="leading-relaxed capitalize text-gray-500 mb-4">{description}</p>}

      <div className="relative max-w-[600px]">
        <input
          className="w-full py-3 pr-[120px] pl-4 text-[15px] border border-gray-200 rounded-lg bg-white outline-none transition-colors cursor-pointer hover:border-gray-900 focus:border-gray-900"
          type="search"
          name="search"
          autoComplete="off"
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
        />
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-primary text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-primary/90"
          type="button"
          onClick={handleInputClick}
        >
          <Search size={18} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      <div className="text-sm mt-2 text-gray-500 capitalize">
        <strong className="text-gray-900">{count}</strong> {infoText}
      </div>

      {showModal && <SearchModal onClose={handleCloseModal} />}
    </>
  );
}
