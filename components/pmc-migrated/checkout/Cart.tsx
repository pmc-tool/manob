// Cart - migrated from PMC (matching original design exactly)
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Skeleton } from "antd";
import CartItem from "./CartItem";
import { useCart } from "@/context/CartContext";
import { PmcButton } from "@/components/ui/pmc-button";

const licenseOptions = [
  { value: "REGULAR", title: "Regular License" },
  { value: "EXTENDED", title: "Extended License" },
];

interface CartProps {
  onClick: () => void;
}

export default function Cart({ onClick }: CartProps) {
  const [isSelected, setIsSelected] = useState(false);
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

  const handleQuantityChange = (id: string, type: string, quantity: number) => {
    if (type === "increment") {
      updateQuantity(id, "increment");
    } else if (type === "decrement" && quantity > 0) {
      updateQuantity(id, "decrement");
    }
  };

  const handleRemove = (id: string) => {
    if (id) {
      removeFromCart(id);
    }
  };

  const checkedToggle = (checked: boolean, id: string) => {
    if (id) {
      toggleItemCheck(id, checked);
    }
  };

  const handleLicenseChange = (id: string, license: string) => {
    if (id && license) {
      changeLicenseType(id);
    }
  };

  useEffect(() => {
    const isSelectedItem = cartItems.some((item) => item.is_checked === true);
    setIsSelected(isSelectedItem);
  }, [cartItems]);

  return (
    <>
      <div className="mb-5 pb-3 border-b-2">
        <h2 className="font-medium text-xl mb-0">Shopping Cart</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {/* Cart Items List */}
          <ul className="list-none m-0 p-0">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="items-start border mb-3 overflow-hidden p-3 lg:p-4 relative rounded-2xl shadow-sm"
                    style={{ backgroundColor: "#FCFCFC" }}
                  >
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))
            ) : error ? (
              <div>Error loading products.</div>
            ) : (
              cartItems?.length > 0 &&
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.product_name}
                  profileLink={`/${item.creator_meta?.user_name}`}
                  itemNumber={item.slug}
                  imageUrl={item.product_image}
                  author={item.creator_name}
                  category={item.primar_category_name}
                  categoryLink={`/category/products/${item.primary_category}/${item.primary_category_slug}`}
                  is_checked={item.is_checked}
                  original_regular_price={+item.regular_price}
                  original_extended_price={+item.extended_price}
                  price={+item.regular_price - +item.regular_discount}
                  extended_price={+item.extended_price - +item.extended_discount}
                  quantity={item.quantity}
                  selectedLicense={item.selected_lic_type}
                  licenseOptions={licenseOptions}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onLicenseChange={handleLicenseChange}
                  checkedToggle={(checked, id) => checkedToggle(checked, id)}
                  isOnSale={item.regular_discount > 0}
                />
              ))
            )}
          </ul>
          <div className={`${cartItems?.length === 0 && "text-center"} mt-2`}>
            <Link
              href="/marketplace"
              className="inline-flex items-center font-medium gap-2 text-primary"
            >
              <ChevronLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
        <div className="lg:col-span-4 xl:pl-5">
          <div className="bg-gray-100 mb-3 p-4 rounded-2xl">
            <div className="sm:p-2 lg:p-0 xl:p-2">
              <h5 className="border-b pb-3 mb-4 text-[19px] font-semibold">Order summary</h5>
              <ul className="flex flex-col text-sm gap-2 list-none mb-0">
                <li className="flex justify-between">
                  Selected Item
                  <span className="text-gray-900 font-medium">
                    {cartTotals.total_selected_items}
                  </span>
                </li>
                <li className="flex justify-between">
                  Total price
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.total_price?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Extended support fee
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.extended_support_fee?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Subtotal
                  <span className="text-gray-900 font-medium">
                    ${cartTotals.subtotal_price?.toFixed(2)}
                  </span>
                </li>
                <li className="flex justify-between">
                  Discount
                  <span className="text-red-500 font-medium">
                    ${cartTotals.total_discount}
                  </span>
                </li>
              </ul>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total payable</span>
                  <span className="text-lg font-semibold mb-0">
                    ${cartTotals.total_payable?.toFixed(2)}
                  </span>
                </div>
                <PmcButton
                  variant="primary"
                  fullWidth
                  disabled={!isSelected}
                  onClick={onClick}
                  className="mt-4"
                  icon={<ArrowRight size={16} />}
                  iconPosition="end"
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
