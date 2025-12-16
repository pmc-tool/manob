// Cart component - matching original PMC design exactly
'use client';

import Link from 'next/link';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { Skeleton } from 'antd';
import CartItem from './CartItem';
import { useCart } from '@/context/CartContext';
import { licenseOptions } from '@/lib/mocks/cart.mock';
import { PmcButton } from '@/components/ui/pmc-button';

interface CartProps {
  onProceedToCheckout?: () => void;
}

export default function Cart({ onProceedToCheckout }: CartProps) {
  const {
    cartItems,
    cartTotals,
    isLoading,
    error,
    removeFromCart,
    updateQuantity,
    toggleItemCheck,
    changeLicenseType,
  } = useCart();

  const hasSelectedItems = cartItems.some(item => item.is_checked);

  const handleQuantityChange = (id: string, type: 'increment' | 'decrement') => {
    updateQuantity(id, type);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckedToggle = (checked: boolean, id: string) => {
    toggleItemCheck(id, checked);
  };

  const handleLicenseChange = (id: string) => {
    changeLicenseType(id);
  };

  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      console.log('Proceeding to checkout with items:', cartItems.filter(item => item.is_checked));
    }
  };

  return (
    <>
      {/* Header - mb-5 pb-3 border-2 border-bottom */}
      <div className="mb-5 pb-3 border-b-2 border-gray-200">
        <h2 className="font-medium text-[21px] mb-0">Shopping Cart</h2>
      </div>

      {/* Main Grid - row g-4 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items - col-lg-8 */}
        <div className="flex-1 lg:w-2/3">
          {/* Cart Items List */}
          <ul className="list-none m-0 p-0">
            {isLoading ? (
              // Loading Skeletons
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="items-start border mb-3 overflow-hidden p-3 lg:p-4 relative rounded-2xl shadow-sm bg-[#FCFCFC]"
                  >
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading cart items.</div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.product_name}
                  profileLink={`/${item.creator_meta.user_name}`}
                  itemNumber={item.slug}
                  imageUrl={item.product_image}
                  author={item.creator_name}
                  category={item.primar_category_name}
                  categoryLink={`/category/products/${item.primary_category}/${item.primary_category_slug}`}
                  is_checked={item.is_checked}
                  original_regular_price={item.regular_price}
                  original_extended_price={item.extended_price}
                  price={item.regular_price - item.regular_discount}
                  extended_price={item.extended_price - item.extended_discount}
                  quantity={item.quantity}
                  selectedLicense={item.selected_lic_type}
                  licenseOptions={licenseOptions}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onLicenseChange={handleLicenseChange}
                  checkedToggle={handleCheckedToggle}
                  isOnSale={item.regular_discount > 0 || item.extended_discount > 0}
                />
              ))
            )}
          </ul>

          {/* Continue Shopping Link - mt-2 */}
          <div className={`mt-2 ${cartItems.length === 0 ? 'text-center' : ''}`}>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 font-medium text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary - col-lg-4 ps-xl-5 */}
        <div className="lg:w-1/3 xl:pl-8">
          {/* bgc-gray-4 mb-3 p-4 rounded-4 */}
          <div className="bg-[#f8f9fa] mb-3 p-4 rounded-2xl">
            {/* p-sm-2 p-lg-0 p-xl-2 */}
            <div className="sm:p-2 lg:p-0 xl:p-2">
              {/* border-bottom pb-3 mb-4 fz19 */}
              <h5 className="border-b border-gray-200 pb-3 mb-4 text-[19px] font-semibold">
                Order summary
              </h5>

              {/* d-flex flex-column fs-sm gap-2 list-unstyled mb-0 */}
              <ul className="flex flex-col text-sm gap-2 list-none mb-0">
                <li className="flex justify-between">
                  <span>Selected Item</span>
                  <span className="text-gray-700 font-medium">
                    {cartTotals.total_selected_items}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total price</span>
                  <span className="text-gray-700 font-medium">
                    ${cartTotals.total_price.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Extended support fee</span>
                  <span className="text-gray-700 font-medium">
                    ${cartTotals.extended_support_fee.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-700 font-medium">
                    ${cartTotals.subtotal_price.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-red-500 font-medium">
                    ${cartTotals.total_discount.toFixed(2)}
                  </span>
                </li>
              </ul>

              {/* border-top pt-4 mt-4 */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {/* d-flex justify-content-between */}
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total payable</span>
                  {/* h5 fz18 mb-0 */}
                  <span className="text-[18px] font-semibold mb-0">
                    ${cartTotals.total_payable.toFixed(2)}
                  </span>
                </div>
                <PmcButton
                  variant="primary"
                  fullWidth
                  disabled={!hasSelectedItems}
                  onClick={handleProceedToCheckout}
                  icon={<ArrowRight className="h-4 w-4" />}
                  className="mt-4"
                >
                  Proceed to checkout
                </PmcButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
