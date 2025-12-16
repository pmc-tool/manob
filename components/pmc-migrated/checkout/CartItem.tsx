// CartItem - migrated from PMC (matching original design exactly)
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import InputSpinner from "./InputSpinner";

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
  onQuantityChange: (id: string, type: string, quantity: number) => void;
  onRemove: (id: string) => void;
  licenseOptions: { value: string; title: string }[];
  selectedLicense: string;
  onLicenseChange: (id: string, license: string) => void;
  checkedToggle: (checked: boolean, id: string) => void;
  isOnSale?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
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
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [selectedLicense, licenseOptions]);

  const selectedTitle =
    licenseOptions.find((opt) => opt.value === selectedLicense)?.title || "";

  return (
    <li className="align-middle bg-white border-b border-gray-200 mb-4 pb-4 relative">
      {/* Remove Button */}
      <button
        type="button"
        className="bg-white absolute right-0 top-0 font-medium text-[13px] px-3 py-2 rounded-2xl text-gray-500 border-0 flex items-center gap-1 cursor-pointer hover:text-red-500"
        onClick={() => onRemove(id)}
      >
        Remove
        <X size={18} />
      </button>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-1 flex w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="sm:w-2/5">
              <div className="flex gap-2 items-center">
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
                      src={imageUrl || "/images/listings/product-draft-default.png"}
                      width={590}
                      height={300}
                      className="w-full h-auto object-cover rounded"
                      alt={title}
                      unoptimized
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="sm:w-3/5">
              {/* Product Title */}
              <h3 className="font-medium text-[18px] mb-2">
                <Link href={`/product-details/${itemNumber}`} className="text-gray-900 hover:text-primary">{title}</Link>
              </h3>
              <div className="italic text-[14px] text-gray-500">
                by{" "}
                <Link className="font-medium not-italic text-gray-700 hover:text-primary" href={profileLink}>
                  {author}
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-600">Qty:</span>
                <InputSpinner
                  min={minQuantity}
                  max={maxQuantity}
                  step={1}
                  initialValue={quantity}
                  onChange={(value, type) => onQuantityChange(id, type, value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <hr className="opacity-100 mt-2 sm:hidden border-gray-200" />
          <div className="flex items-center justify-center sm:justify-end">
            {/* Original Price (strikethrough if on sale) */}
            {isOnSale && (
              <div className="font-normal text-[19px] text-gray-400 line-through mr-2">
                <sup className="text-[14px]">$</sup>
                {selectedLicense === "REGULAR"
                  ? original_regular_price
                  : original_extended_price}
              </div>
            )}
            {/* Current Price */}
            <div className="font-medium text-[27px] text-primary">
              <sup className="text-[14px]">$</sup>
              {selectedLicense === "REGULAR" ? price : extended_price}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end mt-2">
            <select
              className="border border-primary/30 bg-primary/10 text-sm font-medium px-2 py-1.5 rounded-lg text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 pr-6"
              aria-label="Select License"
              value={selectedLicense}
              onChange={(e) => onLicenseChange(id, e.target.value)}
              style={{ width: width > 0 ? `${width}px` : "auto" }}
            >
              {licenseOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>

            {/* Hidden span to calculate width */}
            <span
              ref={spanRef}
              className="absolute invisible"
              style={{
                whiteSpace: "pre",
                fontWeight: 500,
                paddingLeft: "0.5rem",
                paddingRight: "1.5rem",
                fontSize: "0.875rem",
                fontFamily: "inherit",
              }}
            >
              {selectedTitle}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
