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
    <div className="p-3 p-xl-4 w-100 border rounded-3 bg-white mb-3 mt-4">
      <div className="row g-4 justify-content-between">
        <div className="col-sm-auto">
          <h5 className="d-block mb-2">Secure Card Payment</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="pay-by-pmc-stripe"
              onChange={payByStripe}
            />
            <label className="form-check-label" htmlFor="pay-by-pmc-stripe">
              <span>Total Price: ${payAbleAmount.toFixed(2)}</span>
            </label>
          </div>
        </div>
        <div className="col-sm col-xxl-6">
          <div
            className={`d-inline-block border p-3 rounded-3 position-relative pt-4`}
          >
            <div className={`fst-italic fz13 ${styles.stripeBadgeText}`}>
              <span className="me-1">Powered by</span>
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
              className="img-fluid"
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
