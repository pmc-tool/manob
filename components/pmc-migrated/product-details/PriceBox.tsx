// Price Box component with license selection (matching original PMC design)
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, ShoppingCart, ChevronRight } from 'lucide-react';
import { License, formatPrice } from '@/lib/mocks/product-details.mock';

interface PriceBoxProps {
  licenses: License[];
  productName: string;
  productDescription?: string;
  supportProvider: string;
  isOwner?: boolean;
  userName?: string;
  currentStatus?: string;
  onAddToCart?: (data: { isExtend: boolean; lic_type: string }) => void;
  sellerProfile?: string;
  dropdownItems?: Array<{ label: string; action: () => void }>;
}

export default function PriceBox({
  licenses,
  productName,
  productDescription = '',
  supportProvider,
  isOwner = false,
  userName,
  currentStatus = '',
  onAddToCart,
  sellerProfile,
  dropdownItems,
}: PriceBoxProps) {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(licenses[0] || null);
  const [extendSupport, setExtendSupport] = useState(false);
  const [licenseDropdownOpen, setLicenseDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (licenses.length > 0) {
      setSelectedLicense(licenses[0]);
    }
  }, [licenses]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowBottomBar(false);
      } else {
        setShowBottomBar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLicenseSelect = (license: License) => {
    setSelectedLicense(license);
    setLicenseDropdownOpen(false);
  };

  const handleExtendSupportChange = () => {
    setExtendSupport(!extendSupport);
  };

  const totalPrice = selectedLicense
    ? Number(selectedLicense.price) + (extendSupport ? Number(selectedLicense.extendSupportPrice) : 0)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart && selectedLicense) {
      onAddToCart({ isExtend: extendSupport, lic_type: selectedLicense.lic_type });
    }
  };

  const canAddToCart = currentStatus === 'PUBLISHED';

  return (
    <>
      <div className="mb-4 p-3 sm:p-4 relative rounded-lg shadow bg-white">
        <div className="price-content">
          {/* Owner purchased notification */}
          {isOwner && (
            <div className="border download-item mb-3 p-2 sm:p-3 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg width={40} height={45} viewBox="0 0 44 50" fill="none">
                    <path
                      d="M13.1461 46.2126H8.92226V9.17619C10.561 8.59499 11.7381 7.03002 11.7381 5.19453C11.7381 2.86551 9.84334 0.970703 7.51432 0.970703C5.1853 0.970703 3.29049 2.86551 3.29049 5.19453C3.29049 7.03002 4.46763 8.59499 6.10638 9.17619V46.2126H1.88255C1.10499 46.2126 0.474609 46.843 0.474609 47.6205C0.474609 48.3981 1.10499 49.0285 1.88255 49.0285H13.1461C13.9236 49.0285 14.554 48.3981 14.554 47.6205C14.554 46.843 13.9236 46.2126 13.1461 46.2126Z"
                      fill="#EFA507"
                    />
                    <path
                      d="M10.7383 33.7993L26.6124 29.2638C26.9066 29.1799 27.1654 29.0023 27.3497 28.7581C27.5339 28.5139 27.6336 28.2162 27.6336 27.9103V16.6468C27.6336 16.0179 27.2168 15.466 26.6124 15.2933L10.7383 10.7578V33.7993Z"
                      fill="#EFA507"
                    />
                    <path
                      d="M43.0254 26.4584L29.715 22V27.8204C29.715 29.7328 28.4368 31.4365 26.6061 31.962L24 32.7105V33.5633C24 34.5523 24.9673 35.2331 25.8802 34.9253L43.0254 29.1824C44.3233 28.7484 44.3265 26.8935 43.0254 26.4584Z"
                      fill="#EFA507"
                    />
                  </svg>
                </div>
                <div className="flex-grow ml-3">
                  <h6 className="font-semibold">You have bought this item.</h6>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/freelancer-list" className="ud-btn btn-thm fz13 px-3 py-2 rounded-lg font-medium">
                      Hire Freelancer
                    </Link>
                    <div className="relative flex-grow">
                      <button
                        type="button"
                        onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                        className="ud-btn btn-soft-primary dropdown-toggle fz13 px-3 py-2 rounded-3 fw-medium w-full"
                      >
                        Download
                      </button>
                      {downloadDropdownOpen && dropdownItems && (
                        <ul className="absolute right-0 mt-1 w-full bg-white rounded-lg shadow-lg border z-10">
                          {dropdownItems.map((item, index) => (
                            <li key={index}>
                              <button
                                onClick={() => {
                                  item.action();
                                  setDownloadDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* License and Price */}
          <div className="flex flex-wrap items-center gap-2 justify-between">
            {/* License dropdown - Original: dropdown license-dropdown */}
            <div className="license-dropdown relative">
              <button
                id="license-button"
                type="button"
                onClick={() => setLicenseDropdownOpen(!licenseDropdownOpen)}
                className="ud-btn btn-soft-primary dropdown-toggle px-3 py-2 rounded-2"
              >
                {selectedLicense?.type || 'Select License'}
              </button>
              {licenseDropdownOpen && (
                <ul className="absolute left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border z-10">
                  {licenses.map((license) => (
                    <li key={license.type}>
                      <button
                        onClick={() => handleLicenseSelect(license)}
                        className={`w-full text-left p-4 hover:bg-gray-50 first:rounded-t-lg license-item ${
                          selectedLicense?.type === license.type ? 'active' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-2">
                          <h5 className="fz16 font-bold mb-0">{license.type}</h5>
                          {selectedLicense?.type === license.type && (
                            <span className="badge bg-green-500 text-white text-xs px-2 py-0.5 rounded selected-badge">
                              Selected
                            </span>
                          )}
                          <div className="font-bold fz21 ml-auto">
                            <sup>$</sup>
                            {formatPrice(license.price)}
                          </div>
                        </div>
                        <p className="fz14 leading-normal text-gray-600 mb-0">{license.description}</p>
                      </button>
                    </li>
                  ))}
                  <li>
                    <div className="text-center py-2 border-t">
                      <Link href="/licenses" className="font-medium fz14 text-primary flex items-center justify-center">
                        View license details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                </ul>
              )}
            </div>

            {/* Product Price */}
            <div className="price flex items-center gap-2 mb-0">
              {selectedLicense?.oldPrice && selectedLicense.oldPrice > 0 && (
                <div id="old-price" className="font-normal fz19 text-gray-400 line-through">
                  <sup>$</sup>
                  {formatPrice(selectedLicense.oldPrice)}
                </div>
              )}
              <span id="current-price" className="text-primary fz32 font-bold">
                <sup>$</sup>
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <hr className="opacity-100 mb-3 mt-2" />

          <div className="h5 mb-2 font-semibold">{productName}</div>
          {productDescription && <p className="text fz14">{productDescription}</p>}

          <hr className="opacity-100 mb-3" />

          {/* Benefits */}
          <ul className="flex flex-col gap-2 list-none mb-0 text-gray-700 support-text">
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary" />
              <span>
                Quality checked by <span className="font-medium">manob.ai</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary" />
              <span>Future updates</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={18} className="text-primary" />
              <span>
                6 months support from{' '}
                <Link href={sellerProfile || '#'} className="text-primary">
                  {supportProvider}
                </Link>
              </span>
            </li>
          </ul>

          <hr className="opacity-100 mb-3 mt-3" />

          {/* Extend Support */}
          <div className="extend-support form-check mb-3">
            <label className="flex items-center font-medium gap-2 leading-none text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={extendSupport}
                onChange={handleExtendSupportChange}
                className="form-check-input w-4 h-4"
              />
              <span>Extend support to 12 months</span>
              <span className="flex items-end gap-2 ml-auto">
                {selectedLicense?.extendSupportOldPrice && selectedLicense.extendSupportOldPrice > 0 && (
                  <span id="extend-support-old-price" className="text-gray-400 line-through">
                    ${formatPrice(selectedLicense.extendSupportOldPrice)}
                  </span>
                )}
                <span id="extend-support-current-price" className="font-bold fz19">
                  ${formatPrice(selectedLicense?.extendSupportPrice || 0)}
                </span>
              </span>
            </label>
          </div>

          {/* Add to Cart Button */}
          <div className="grid gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`ud-btn btn-thm ${!canAddToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Add To Cart
              <ShoppingCart size={18} className="ms-2 inline-block" />
            </button>
          </div>

          <div className="font-mono italic fz13 mt-1 text-center text-gray-500">
            Price is in US dollars and excludes tax and handling fees
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white z-30 py-3 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
          showBottomBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`ud-btn btn-thm w-full py-2 flex items-center justify-center gap-2 ${
              !canAddToCart ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Add To Cart
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 576 512">
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20l44 0 0 44c0 11 9 20 20 20s20-9 20-20l0-44 44 0c11 0 20-9 20-20s-9-20-20-20l-44 0 0-44c0-11-9-20-20-20s-20 9-20 20l0 44-44 0c-11 0-20 9-20 20z" />
            </svg>
            <span className="fz19">
              <sup>$</sup>
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
