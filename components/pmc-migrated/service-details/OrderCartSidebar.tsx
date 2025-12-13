'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import InputSpinner from './InputSpinner';
import PackageDetails from './PackageDetails';

interface PackageAttribute {
  key: string;
  value: boolean | string | null;
}

interface PackageInfo {
  title: string;
  short_description: string;
  price: number;
  discounted_price?: number;
  delivery_time: number;
  attributes?: PackageAttribute[];
}

interface OrderCartSidebarProps {
  isActive: boolean;
  onClose: () => void;
  serviceId: string;
  packageInfo: PackageInfo | null;
  packageTitle: string;
  onContinue?: (data: { serviceId: string; quantity: number; packageTitle: string; total: number }) => void;
}

export default function OrderCartSidebar({
  isActive,
  onClose,
  serviceId,
  packageInfo,
  packageTitle,
  onContinue,
}: OrderCartSidebarProps) {
  const [quantity, setQuantity] = useState(1);

  // Calculate selected price (use discounted if available)
  const selectedServicePrice = packageInfo
    ? (packageInfo.discounted_price && packageInfo.discounted_price < packageInfo.price
        ? packageInfo.discounted_price
        : packageInfo.price)
    : 0;

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isActive]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        serviceId,
        quantity,
        packageTitle,
        total: selectedServicePrice * quantity,
      });
    } else {
      console.log('Continue with order:', {
        serviceId,
        quantity,
        packageTitle,
        total: selectedServicePrice * quantity,
      });
    }
  };

  if (!packageInfo) return null;

  return (
    <>
      {/* Sidebar */}
      <div className={`order-cart-sidebar ${isActive ? 'active' : ''}`}>
        {/* Sidebar Header */}
        <div className="order-cart-header" id="sidebarHeader">
          <span className="fz20 fw-semibold text-dark">Order Options</span>
          <button
            className="order-cart-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="order-cart-body">
          {/* Package Title & Price */}
          <div className="order-cart-package-info">
            <div className="order-cart-package-row">
              <h5 className="fz18 mb-0">{packageInfo.title}</h5>
              <h5 className="fz18 mb-0">${selectedServicePrice}</h5>
            </div>
            <div className="text-muted">{packageInfo.short_description}</div>
          </div>

          {/* How often section */}
          <h5 className="fz18 mb-3">How often do you need this order</h5>

          {/* Single Order Box */}
          <div className="order-cart-single-order">
            <div className="order-cart-single-order-header">
              <h5 className="fz18 mb-0">Single Order</h5>
              <h5 className="fz18 mb-0">${selectedServicePrice}</h5>
            </div>
            <div className="order-cart-quantity-row">
              <span>Gig Quantity:</span>
              <InputSpinner
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={20}
              />
            </div>
          </div>

          {/* Service Details */}
          <PackageDetails
            title="Service Details"
            packageInfo={packageInfo}
          />

          {/* Order Summary */}
          <div className="order-cart-summary-section">
            <h5 className="fz18 mb-3">Order Summary</h5>
            <ul className="order-cart-summary-list">
              <li>
                <span className="text-dark fw-medium">Sub Total:</span>
                <span className="text-muted">
                  ${(selectedServicePrice * quantity).toFixed(2)}
                </span>
              </li>
              <li>
                <span className="text-dark fw-medium">Discount:</span>
                <span className="text-danger fw-medium">-$0.00</span>
              </li>
            </ul>
          </div>

          {/* Total Price */}
          <div className="order-cart-total">
            <span className="text-dark fw-medium">Total price:</span>
            <span className="fz18 fw-semibold">
              ${(selectedServicePrice * quantity).toFixed(2)}
            </span>
          </div>

          {/* Warning Alert */}
          <div className="order-cart-alert">
            <Info className="h-6 w-6 flex-shrink-0" />
            <div className="text-muted">
              This money will be kept in the PMC, paid to the service provider
              after the order is completed
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="order-cart-footer" id="sidebarFooter">
          <button
            className="ud-btn btn-thm w-full"
            onClick={handleContinue}
          >
            Continue With (${(selectedServicePrice * quantity).toFixed(2)})
          </button>
          <div className="text-muted mt-2 text-center text-sm">
            You won&apos;t be charged yet
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`order-cart-overlay ${isActive ? 'active' : ''}`}
        onClick={onClose}
      />
    </>
  );
}
