"use client";

import { Card } from "antd";
import CheckoutForm from "./CheckoutForm";

interface StripePaymentMethodProps {
  remainingBalance: number;
  onCloseModal: () => void;
  clientSecret: string;
}

export default function StripePaymentMethod({
  remainingBalance,
  onCloseModal,
  clientSecret,
}: StripePaymentMethodProps) {
  return (
    <div>
      <h5 className="mb-3 font-semibold">Remaining payment: ${remainingBalance.toFixed(2)}</h5>
      <Card>
        <div id="checkout">
          <CheckoutForm
            clientSecret={clientSecret}
            onCloseModal={onCloseModal}
          />
        </div>
      </Card>
    </div>
  );
}
