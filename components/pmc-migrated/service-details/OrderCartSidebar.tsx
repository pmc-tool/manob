'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import InputSpinner from './InputSpinner';
import PackageDetails from './PackageDetails';
import { PmcButton } from '@/components/ui/pmc-button';
import styles from './OrderCartSidebar.module.css';

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
      <div className={`${styles.sidebar} ${isActive ? styles.active : ''}`}>
        {/* Sidebar Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Order Options</span>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className={styles.body}>
          {/* Package Title & Price */}
          <div className={styles.packageInfo}>
            <div className={styles.packageRow}>
              <h5 className={styles.packageTitle}>{packageInfo.title}</h5>
              <h5 className={styles.packageTitle}>${selectedServicePrice}</h5>
            </div>
            <div className="text-gray-500">{packageInfo.short_description}</div>
          </div>

          {/* How often section */}
          <h5 className={styles.sectionTitle}>How often do you need this order</h5>

          {/* Single Order Box */}
          <div className={styles.singleOrder}>
            <div className={styles.singleOrderHeader}>
              <h5 className={styles.packageTitle}>Single Order</h5>
              <h5 className={styles.packageTitle}>${selectedServicePrice}</h5>
            </div>
            <div className={styles.quantityRow}>
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
          <div className={styles.summarySection}>
            <h5 className={styles.sectionTitle}>Order Summary</h5>
            <ul className={styles.summaryList}>
              <li>
                <span className="text-gray-900 font-medium">Sub Total:</span>
                <span className="text-gray-500">
                  ${(selectedServicePrice * quantity).toFixed(2)}
                </span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Discount:</span>
                <span className="text-red-600 font-medium">-$0.00</span>
              </li>
            </ul>
          </div>

          {/* Total Price */}
          <div className={styles.total}>
            <span className="text-gray-900 font-medium">Total price:</span>
            <span className="text-lg font-semibold">
              ${(selectedServicePrice * quantity).toFixed(2)}
            </span>
          </div>

          {/* Warning Alert */}
          <div className={styles.alert}>
            <Info className="h-6 w-6 flex-shrink-0" />
            <div>
              This money will be kept in the PMC, paid to the service provider
              after the order is completed
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={styles.footer}>
          <PmcButton
            variant="primary"
            fullWidth
            onClick={handleContinue}
          >
            Continue With (${(selectedServicePrice * quantity).toFixed(2)})
          </PmcButton>
          <div className="text-gray-500 mt-2 text-center text-sm">
            You won&apos;t be charged yet
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isActive ? styles.active : ''}`}
        onClick={onClose}
      />
    </>
  );
}
