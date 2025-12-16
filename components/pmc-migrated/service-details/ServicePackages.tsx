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
import { PmcButton, SecondaryButton } from '@/components/ui/pmc-button';

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
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
      {/* Package Tabs */}
      <div className="rounded-t-lg overflow-hidden">
        <ul className="flex bg-[#f9f9f9] m-0 p-0 list-none">
          {packages.map((pkg, index) => (
            <li key={pkg.id} className="flex-1 border-r border-[#e9e9e9] last:border-r-0">
              <button
                type="button"
                onClick={() => setActivePackage(index)}
                className={`inline-flex items-center justify-center w-full py-3.5 px-4 text-[15px] font-semibold text-center bg-transparent border-none border-b-2 cursor-pointer transition-all leading-normal ${activePackage === index ? 'text-primary bg-white border-b-primary' : 'text-[#697488] border-b-transparent hover:text-primary'}`}
              >
                {pkg.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Package Content */}
      <div className="p-5">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className={activePackage === index ? 'block' : 'hidden'}
          >
            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[28px] font-bold text-gray-900">${formatPrice(pkg.price)}</span>
              {pkg.oldPrice && pkg.oldPrice > pkg.price && (
                <span className="text-base text-gray-400 line-through">${formatPrice(pkg.oldPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-[15px] mb-4">{pkg.description}</p>

            {/* Delivery & Revisions */}
            <div className="delivery-info flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <span className="inline-flex items-center gap-2 text-gray-700 text-sm">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium">{pkg.deliveryDays} days delivery</span>
              </span>
              <span className="inline-flex items-center gap-2 text-gray-700 text-sm">
                <RotateCcw className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium">{pkg.revisions} revisions</span>
              </span>
            </div>

            {/* Features */}
            <ul className="feature-list space-y-3 mb-5">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="space-y-3">
              <PmcButton
                variant="primary"
                fullWidth
                onClick={() => handleOrderNow(pkg)}
              >
                Continue (${formatPrice(pkg.price)})
              </PmcButton>
              <SecondaryButton
                fullWidth
                onClick={() => handleAddToCart(pkg.id)}
                icon={<ShoppingCart className="h-4 w-4" />}
              >
                Add to Cart
              </SecondaryButton>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Packages Link */}
      <div className="border-t p-4 text-center bg-gray-50">
        <button className="text-primary text-sm font-medium hover:underline">
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
