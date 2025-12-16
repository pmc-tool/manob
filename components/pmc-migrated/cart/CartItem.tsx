// CartItem component - matching original PMC design exactly
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import InputSpinner from '../service-details/InputSpinner';

interface CartItemProps {
  id: string;
  title: string;
  profileLink: string;
  categoryLink?: string;
  itemNumber: string;
  imageUrl: string | null;
  author: string;
  category: string;
  is_checked: boolean;
  price: number;
  original_regular_price?: number;
  original_extended_price?: number;
  extended_price: number;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange: (id: string, type: 'increment' | 'decrement') => void;
  onRemove: (id: string) => void;
  licenseOptions: { value: string; title: string }[];
  selectedLicense: string;
  onLicenseChange: (id: string) => void;
  checkedToggle: (checked: boolean, id: string) => void;
  isOnSale?: boolean;
}

export default function CartItem({
  id,
  title,
  profileLink,
  itemNumber,
  imageUrl,
  author,
  is_checked,
  price,
  original_regular_price = 0,
  original_extended_price = 0,
  extended_price,
  quantity,
  minQuantity = 1,
  maxQuantity = 10,
  onQuantityChange,
  onRemove,
  licenseOptions,
  selectedLicense,
  onLicenseChange,
  checkedToggle,
  isOnSale = false,
}: CartItemProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [selectWidth, setSelectWidth] = useState<number>(0);

  useEffect(() => {
    if (spanRef.current) {
      setSelectWidth(spanRef.current.offsetWidth);
    }
  }, [selectedLicense, licenseOptions]);

  const selectedTitle =
    licenseOptions.find((opt) => opt.value === selectedLicense)?.title || '';

  const currentPrice = selectedLicense === 'REGULAR' ? price : extended_price;
  const originalPrice = selectedLicense === 'REGULAR' ? original_regular_price : original_extended_price;

  return (
    // align-middle bg-white border-b cart-item items mb-4 odd pb-4 position-relative
    <li className="align-middle bg-white border-b border-gray-200 mb-4 pb-4 relative">
      {/* Remove Button - bg-white end-0 font-medium text-[13px] position-absolute px-3 py-2 rounded-xl text-gray-500 top-0 border-0 */}
      <button
        type="button"
        className="bg-white absolute right-0 top-0 font-medium text-[13px] px-3 py-2 rounded-mdxl text-gray-500 border-0 hover:text-red-500 flex items-center gap-1 cursor-pointer"
        onClick={() => onRemove(id)}
      >
        Remove
        <X className="h-[18px] w-[18px]" />
      </button>

      {/* row g-3 items-center justify-content-between */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* col-sm flex */}
        <div className="flex-1 flex w-full">
          {/* row g-3 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* col-sm-5 - Checkbox + Image */}
            <div className="sm:w-2/5">
              {/* flex gap-1 items-center */}
              <div className="flex gap-2 items-center">
                {/* form-check */}
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 accent-primary cursor-pointer"
                    checked={is_checked}
                    onChange={() => checkedToggle(!is_checked, id)}
                    type="checkbox"
                  />
                </div>
                {/* Product Image */}
                <div className="flex-1">
                  <Link href={`/product-details/${itemNumber}`}>
                    <Image
                      src={imageUrl || '/images/listings/product-draft-default.png'}
                      width={590}
                      height={300}
                      className="w-full h-auto object-cover rounded-lg"
                      alt={title}
                      unoptimized
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* col-sm-7 - Product Info */}
            <div className="sm:w-3/5">
              {/* font-medium text-lg item-title mb-2 */}
              <h3 className="font-medium text-[18px] mb-2">
                <Link href={`/product-details/${itemNumber}`} className="text-gray-900 hover:text-primary">
                  {title}
                </Link>
              </h3>
              {/* fst-italic text-sm text-black-50 */}
              <div className="italic text-[14px] text-gray-500">
                by{' '}
                <Link className="font-medium not-italic text-gray-700 hover:text-primary" href={profileLink}>
                  {author}
                </Link>
              </div>
              {/* flex items-center gap-2 mt-2 */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-600">Qty:</span>
                <InputSpinner
                  value={quantity}
                  onChange={(value) => {
                    const type = value > quantity ? 'increment' : 'decrement';
                    onQuantityChange(id, type);
                  }}
                  min={minQuantity}
                  max={maxQuantity}
                />
              </div>
            </div>
          </div>
        </div>

        {/* col-sm-auto - Price + License */}
        <div className="w-full sm:w-auto">
          {/* hr opacity-100 mt-2 d-sm-none */}
          <hr className="opacity-100 mt-2 sm:hidden border-gray-200" />
          {/* items-center flex justify-content-center */}
          <div className="flex items-center justify-center sm:justify-end">
            {/* Original Price (if on sale) - font-normal text-[19px] text-black-50 text-decoration-line-through mr-2 */}
            {isOnSale && originalPrice > currentPrice && (
              <div className="font-normal text-[19px] text-gray-400 line-through mr-2">
                <sup className="text-[14px]">$</sup>
                {originalPrice}
              </div>
            )}
            {/* Current Price - font-medium text-[27px] text-thm */}
            <div className="font-medium text-[27px] text-primary">
              <sup className="text-[14px]">$</sup>
              {currentPrice}
            </div>
          </div>

          {/* License Select - border-primary-soft bgc-thm8 form-select form-select-sm font-medium pe-3 ps-2 rounded-lg text-thm */}
          <div className="flex justify-center sm:justify-end mt-2">
            <select
              className="border border-primary/30 bg-primary/10 text-sm font-medium px-2 py-1.5 rounded-lg text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 pr-6"
              aria-label="Select License"
              value={selectedLicense}
              onChange={() => onLicenseChange(id)}
              style={{ width: selectWidth > 0 ? `${selectWidth}px` : 'auto' }}
            >
              {licenseOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>

            {/* Hidden span to calculate width - position-absolute visibility-hidden */}
            <span
              ref={spanRef}
              className="absolute invisible"
              style={{
                whiteSpace: 'pre',
                fontWeight: 500,
                paddingLeft: '0.5rem',
                paddingRight: '1.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            >
              {selectedTitle}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
