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
    <li className="align-middle bg-white border-bottom cart-item items mb-4 odd pb-4 position-relative">
      {/* Remove Button */}
      <button
        type="button"
        className="bg-white end-0 fw-medium fz13 position-absolute px-3 py-2 rounded-4 text-muted top-0 border-0 d-flex align-items-center gap-1"
        onClick={() => onRemove(id)}
        style={{ cursor: "pointer" }}
      >
        Remove
        <X size={18} />
      </button>

      <div className="row g-3 align-items-center justify-content-between">
        <div className="col-sm d-flex">
          <div className="row g-3">
            <div className="col-sm-5">
              <div className="d-flex gap-1 align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    checked={is_checked}
                    onChange={() => checkedToggle(!is_checked, id)}
                    type="checkbox"
                  />
                </div>
                {/* Product Image */}
                <div>
                  <Link href={`/product-details/${itemNumber}`}>
                    <Image
                      src={imageUrl || "/images/listings/product-draft-default.png"}
                      width={590}
                      height={300}
                      className="h-100 w-100 object-fit-cover rounded"
                      alt={title}
                      unoptimized
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-sm-7">
              {/* Product Title */}
              <h3 className="fw-medium fz18 item-title mb-2">
                <Link href={`/product-details/${itemNumber}`}>{title}</Link>
              </h3>
              <div className="fst-italic fz14 text-black-50">
                by{" "}
                <Link className="fw-medium fst-normal" href={profileLink}>
                  {author}
                </Link>
              </div>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span>Qty:</span>
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
        <div className="col-sm-auto">
          <hr className="opacity-100 mt-2 d-sm-none" />
          <div className="align-items-center d-flex justify-content-center">
            {/* Original Price (strikethrough if on sale) */}
            {isOnSale && (
              <div className="fw-normal fz19 text-black-50 text-decoration-line-through me-2">
                <sup className="fz14">$</sup>
                {selectedLicense === "REGULAR"
                  ? original_regular_price
                  : original_extended_price}
              </div>
            )}
            {/* Current Price */}
            <div className="fw-medium fz27 text-thm">
              <sup className="fz14">$</sup>
              {selectedLicense === "REGULAR" ? price : extended_price}
            </div>
          </div>
          <select
            className="border-primary-soft bgc-thm8 form-select form-select-sm fw-medium pe-3 ps-2 rounded-3 text-thm"
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
            className="position-absolute visibility-hidden"
            style={{
              whiteSpace: "pre",
              fontWeight: 500,
              paddingLeft: "0.5rem",
              paddingRight: "1.5rem",
              fontSize: "0.875rem",
              fontFamily: "inherit",
              visibility: "hidden",
            }}
          >
            {selectedTitle}
          </span>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
