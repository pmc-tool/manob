// Service Packages component (matching original PMC design)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Clock, RotateCcw, ShoppingCart } from 'lucide-react';
import { message } from 'antd';
import { ServicePackage, formatPrice } from '@/lib/mocks/service-details.mock';
import OrderCartSidebar from './OrderCartSidebar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface ServicePackagesProps {
  packages: ServicePackage[];
  serviceId?: string;
  onOrderNow?: (packageId: string) => void;
  onAddToCart?: (packageId: string) => void;
}

// Convert features to attributes format for sidebar
function featuresToAttributes(features: string[]) {
  return features.map(feature => ({
    key: feature,
    value: true as boolean | string | null,
  }));
}

export default function ServicePackages({
  packages,
  serviceId = 'service-001',
  onOrderNow,
  onAddToCart,
}: ServicePackagesProps) {
  const router = useRouter();
  const { addServiceToCart } = useCart();
  const { isAuthenticated, openLoginModal } = useAuth();

  const [activePackage, setActivePackage] = useState(1); // Default to Standard (middle)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{
    title: string;
    short_description: string;
    price: number;
    discounted_price?: number;
    delivery_time: number;
    attributes?: { key: string; value: boolean | string | null }[];
  } | null>(null);
  const [selectedPackageTitle, setSelectedPackageTitle] = useState('');

  const handleOrderNow = (pkg: ServicePackage) => {
    // Convert to sidebar format matching original PMC
    const packageInfo = {
      title: pkg.name,
      short_description: pkg.description,
      price: pkg.price,
      discounted_price: pkg.oldPrice && pkg.oldPrice > pkg.price ? pkg.price : undefined,
      delivery_time: pkg.deliveryDays,
      attributes: featuresToAttributes(pkg.features),
    };

    setSelectedPackageInfo(packageInfo);
    setSelectedPackageTitle(pkg.name);
    setSidebarOpen(true);

    if (onOrderNow) {
      onOrderNow(pkg.id);
    }
  };

  const handleAddToCart = (packageId: string) => {
    if (onAddToCart) {
      onAddToCart(packageId);
    } else {
      console.log('Add to cart:', packageId);
    }
  };

  const handleContinueOrder = (data: { serviceId: string; quantity: number; packageTitle: string; total: number }) => {
    // Check authentication
    if (!isAuthenticated) {
      message.warning('Please sign in to continue');
      openLoginModal();
      return;
    }

    // Add to cart context for service order
    addServiceToCart({
      service_id: data.serviceId,
      quantity: data.quantity,
      service_plan: data.packageTitle,
      package_info: selectedPackageInfo ? {
        title: selectedPackageInfo.title,
        price: selectedPackageInfo.price,
        discounted_price: selectedPackageInfo.discounted_price,
        delivery_time: selectedPackageInfo.delivery_time,
      } : undefined,
    });

    setSidebarOpen(false);

    // Navigate to service payment page
    router.push(`/service-payment?service=${data.serviceId}&plan=${encodeURIComponent(data.packageTitle)}&qty=${data.quantity}`);
  };

  return (
    <div className="service-packages mb-4 bg-white">
      {/* Package Tabs - Original PMC navpill-style1 */}
      <div className="navpill-style1">
        <ul className="nav-tabs">
          {packages.map((pkg, index) => (
            <li key={pkg.id} className="nav-item">
              <button
                type="button"
                onClick={() => setActivePackage(index)}
                className={`nav-link ${activePackage === index ? 'active' : ''}`}
              >
                {pkg.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Package Content */}
      <div className="package-content">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className={activePackage === index ? 'block' : 'hidden'}
          >
            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="package-price">${formatPrice(pkg.price)}</span>
              {pkg.oldPrice && pkg.oldPrice > pkg.price && (
                <span className="package-old-price">${formatPrice(pkg.oldPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 fz15 mb-4">{pkg.description}</p>

            {/* Delivery & Revisions */}
            <div className="delivery-info flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <span className="inline-flex items-center gap-2 text-gray-700 fz14">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium">{pkg.deliveryDays} days delivery</span>
              </span>
              <span className="inline-flex items-center gap-2 text-gray-700 fz14">
                <RotateCcw className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium">{pkg.revisions} revisions</span>
              </span>
            </div>

            {/* Features */}
            <ul className="feature-list space-y-3 mb-5">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 fz14">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOrderNow(pkg)}
                className="ud-btn btn-thm w-full"
              >
                Continue (${formatPrice(pkg.price)})
              </button>
              <button
                onClick={() => handleAddToCart(pkg.id)}
                className="ud-btn btn-soft-primary w-full"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Packages Link */}
      <div className="border-t p-4 text-center bg-gray-50">
        <button className="text-primary fz14 font-medium hover:underline">
          Compare Packages
        </button>
      </div>

      {/* Order Cart Sidebar */}
      <OrderCartSidebar
        isActive={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        serviceId={serviceId}
        packageInfo={selectedPackageInfo}
        packageTitle={selectedPackageTitle}
        onContinue={handleContinueOrder}
      />
    </div>
  );
}
