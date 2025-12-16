// PmcStripe - migrated from PMC
"use client";

import Image from "next/image";
import styles from "./PmcStripe.module.css";

interface IProps {
  payAbleAmount: number;
  actualBalance: number;
  handlePaymentMethodChange: (type: string, value: boolean) => void;
}

export default function PmcStripe({
  payAbleAmount,
  handlePaymentMethodChange,
}: IProps) {
  const payByStripe = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    handlePaymentMethodChange("STRIPE", checked);
  };

  return (
    <div className="p-3 xl:p-4 w-full border rounded-lg bg-white mb-3 mt-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="sm:w-auto">
          <h5 className="block mb-2 font-semibold">Secure Card Payment</h5>
          <div className="flex items-center gap-2">
            <input
              className="w-4 h-4 accent-primary cursor-pointer"
              type="radio"
              name="paymentMethod"
              id="pay-by-pmc-stripe"
              onChange={payByStripe}
            />
            <label className="text-sm" htmlFor="pay-by-pmc-stripe">
              <span>Total Price: ${payAbleAmount.toFixed(2)}</span>
            </label>
          </div>
        </div>
        <div className="sm:flex-1 2xl:w-1/2">
          <div
            className={`inline-block border p-3 rounded-lg relative pt-4`}
          >
            <div className={`italic text-[13px] ${styles.stripeBadgeText}`}>
              <span className="mr-1">Powered by</span>
              <Image
                src="/images/stripe-dark.png"
                alt="Stripe"
                width={50}
                height={20}
                unoptimized
              />
            </div>
            <Image
              src="/images/stripe-badge-transparent.png"
              alt="Stripe Badge"
              className="max-w-full h-auto"
              width={200}
              height={26}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
