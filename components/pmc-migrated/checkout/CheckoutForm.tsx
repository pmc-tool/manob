"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { Button } from "antd";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const PAYMENT_TYPE: Record<string, string> = {
  PRODUCT_ORDER: "/cart-payment",
  SERVICE_ORDER: "/service-payment",
  CONNECT_ORDER: "/connect-payment",
  JOB_ORDER: "/job-payment",
  CUSTOM_OFFER: "/job-payment",
};

interface PaymentFormProps {
  clientSecret: string;
  onclose: () => void;
}

function PaymentForm({ clientSecret, onclose }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orderType = useSelector((state: { checkoutStore: { order_type: string } }) => state.checkoutStore.order_type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setIsLoading(false);
      setMessage(submitError.message || "Error submitting payment info.");
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_BASE_URL + PAYMENT_TYPE[orderType],
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setIsLoading(false);
      setMessage(error?.message || "Payment error");
    } else {
      setIsLoading(false);
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {clientSecret && (
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      )}
      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1"
          onClick={onclose}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          className="flex-1"
          loading={isLoading}
          htmlType="submit"
        >
          Pay now
        </Button>
      </div>
      {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
    </form>
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  onCloseModal: () => void;
}

export default function CheckoutForm({ clientSecret, onCloseModal }: CheckoutFormProps) {
  const appearance = {
    rules: {
      "#checkout #payment-form": {
        border: "none !important",
      },
    },
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#ea2725",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      borderRadius: "4px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm clientSecret={clientSecret} onclose={onCloseModal} />
    </Elements>
  );
}
