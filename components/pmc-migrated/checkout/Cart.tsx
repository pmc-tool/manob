// Cart - migrated from PMC (matching original design exactly)
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Skeleton } from "antd";
import CartItem from "./CartItem";
import { useCart } from "@/context/CartContext";

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
      <div className="mb-5 pb-3 border-2 border-bottom">
        <h2 className="fw-medium fz21 mb-0">Shopping Cart</h2>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Cart Items List */}
          <ul className="cart-items__list list-unstyled m-0 p-0">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="align-items-start border mb-3 overflow-hidden p-3 p-lg-4 position-relative rounded-4 shadow-sm"
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
              className="align-items-center d-inline-flex fw-medium gap-2 text-primary"
            >
              <ChevronLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
        <div className="col-lg-4 ps-xl-5">
          <div className="bgc-gray-4 mb-3 p-4 rounded-4">
            <div className="p-sm-2 p-lg-0 p-xl-2">
              <h5 className="border-bottom pb-3 mb-4 fz19">Order summary</h5>
              <ul className="d-flex flex-column fs-sm gap-2 list-unstyled mb-0">
                <li className="d-flex justify-content-between">
                  Selected Item
                  <span className="text-dark-emphasis fw-medium">
                    {cartTotals.total_selected_items}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Total price
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.total_price?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Extended support fee
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.extended_support_fee?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Subtotal
                  <span className="text-dark-emphasis fw-medium">
                    ${cartTotals.subtotal_price?.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  Discount
                  <span className="text-danger fw-medium">
                    ${cartTotals.total_discount}
                  </span>
                </li>
              </ul>
              <div className="border-top pt-4 mt-4">
                <div className="d-flex justify-content-between">
                  <span className="fs-sm">Total payable</span>
                  <span className="h5 fz18 mb-0">
                    ${cartTotals.total_payable?.toFixed(2)}
                  </span>
                </div>
                <button
                  disabled={!isSelected}
                  type="button"
                  className="btn-thm d-block ud-btn w-100 mt-4"
                  onClick={onClick}
                >
                  Proceed to checkout
                  <ArrowRight size={16} className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
