// CheckoutComplete - migrated from PMC (matching original design exactly)
"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { PmcButton } from "@/components/ui/pmc-button";

interface CheckoutCompleteProps {
  totalPrice: number;
  orderNumber?: string;
}

export default function CheckoutComplete({
  totalPrice,
  orderNumber = "34VB5540K83",
}: CheckoutCompleteProps) {
  useEffect(() => {
    // Facebook Pixel tracking - will be available when connected to backend
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        currency: "USD",
        value: totalPrice,
      });
    }
  }, [totalPrice]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-7 text-center">
          <CheckCircle2 size={70} className="text-success mb-4" />
          <div className="mb-4">
            <h2>Thank you for your purchase!</h2>
            <p className="text-black-50 mb-1">
              Make sure you make note of your purchase number, which is{" "}
              <strong className="text-dark">{orderNumber}.</strong>
            </p>
            <p className="text-black-50 mb-0">
              You will be receiving an email shortly with confirmation of your
              purchase. <u>You can now:</u>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/marketplace">
              <PmcButton variant="primary">
                Go back shopping
              </PmcButton>
            </Link>
            <Link href="/user/purchased-products">
              <PmcButton variant="secondary">
                See your Purchased Products
              </PmcButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
