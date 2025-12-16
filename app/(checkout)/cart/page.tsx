// Cart Page - migrated from PMC (matching original design exactly)
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Stepper, Cart, Payment, CheckoutComplete } from "@/components/pmc-migrated/checkout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const steps = [
  { id: "shoppingCart", label: "Shopping Cart" },
  { id: "paymentMethod", label: "Payment Method" },
  { id: "purchaseSuccessful", label: "Purchase Successful" },
];

export default function CartPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { cartItems, cartTotals, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("p_aut");
    if (!token) {
      openLoginModal();
    }
    setIsLoading(false);
  }, [openLoginModal]);

  // Step 0 -> Step 1: Proceed to checkout
  const checkout = () => {
    setCurrentStep(1);
  };

  // Step 1 -> Step 2: Complete payment
  const payment = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call - will connect to real API in production
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success("Order completed successfully!");
      setCurrentStep(2);
      // Clear cart after successful payment
      clearCart();
    } catch (error) {
      message.error("Payment failed. Please try again!");
    } finally {
      setIsProcessing(false);
    }
  };

  const isCartEmpty = !cartItems || cartItems.length === 0;

  if (isLoading) {
    return (
      <section className="pt-4">
        <div className="container">
          <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
            <Spin size="large" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4">
      {isProcessing ? (
        <div className="container">
          <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <div className="container">
          {isCartEmpty && currentStep === 0 ? (
            // Empty Cart State
            <div className="flex justify-center mt-4">
              <div className="w-full lg:w-2/3 xl:w-1/2">
                <div className="text-center">
                  <Image
                    src="/images/empty-cart.svg"
                    alt="Empty Cart"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{
                      maxWidth: "400px",
                      width: "100%",
                      height: "auto",
                    }}
                    className="mb-4"
                    unoptimized
                  />
                  <h3 className="font-semibold">
                    Your shopping cart is empty.
                  </h3>
                  <div className="text-[17px] text-gray-500">
                    Return to the store to add items for your delivery slot.
                    Before proceed to checkout you must add some products to
                    your shopping cart. You will find a lot of interesting
                    products on our shop page.
                  </div>
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 bg-primary text-white shadow-md hover:brightness-110 transition-all mt-4 rounded-full"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Cart Wizard with Stepper
            <div>
              <Stepper
                steps={steps}
                currentStep={currentStep}
              />
              <div className="mt-4">
                {currentStep === 0 && (
                  <Cart onClick={checkout} />
                )}
                {currentStep === 1 && (
                  <Payment
                    onClick={payment}
                    isSaving={isProcessing}
                  />
                )}
                {currentStep === 2 && (
                  <CheckoutComplete
                    totalPrice={cartTotals.total_payable}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
