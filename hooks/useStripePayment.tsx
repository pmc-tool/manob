"use client";

import {
  useGetPayIntentMutation,
  useLazyGetPayIntentVerifyQuery,
} from "@/state/services/pay/pay.service";
import store from "@/state/store";
import toast from "react-hot-toast";
import { validateBillingAddress } from "@/utils/validateBillingAddress";
import {
  useCompleteSubscriptionMutation,
  useGetBillingAddressQuery,
} from "@/state/services/checkout-service/checkout.service";

export type PAYMENT_INTENT_TYPE =
  | "PRODUCT_ORDER"
  | "SERVICE_ORDER"
  | "CONNECT_ORDER"
  | "JOB_ORDER"
  | "CUSTOM_OFFER"
  | "REFUND";

export class StripeOrderRequest {
  static getConnectOrderRequest(body: {
    payment_method: string;
    payment_id: string;
    package_id: string;
    billing_address: object;
  }) {
    return {
      payment_method: body.payment_method,
      payment_id: body.payment_id,
      package_id: body.package_id,
      billing_address: body.billing_address,
    };
  }
}

export default function useStripePayment() {
  const isLoggedIn =
    typeof window !== "undefined" && window.localStorage.getItem("p_aut");
  const [getPaymentIntent] = useGetPayIntentMutation();
  const { data: myBillingDetails, refetch } = useGetBillingAddressQuery(
    undefined,
    {
      skip: !isLoggedIn,
    }
  );
  const [verifyPaymentOrder] = useLazyGetPayIntentVerifyQuery();
  const [completeConnectCheckout] = useCompleteSubscriptionMutation();

  async function getStripe(payment_type: PAYMENT_INTENT_TYPE, meta?: object) {
    const res = await getPaymentIntent({
      payment_type,
      ...meta,
    });

    if ((res as { data?: { status: boolean; data?: { clientSecret: string } } })?.data?.status) {
      return {
        clientSecret: (res as { data: { data: { clientSecret: string } } }).data.data.clientSecret,
        status: true
      };
    }
    return { status: false, clientSecret: "" };
  }

  const stripePayment = async (body: object, type: PAYMENT_INTENT_TYPE) => {
    let res: { data?: { status: boolean; data?: object } } | null = null;

    if (type === "CONNECT_ORDER") {
      res = await completeConnectCheckout(body as never);
    }

    if (res?.data?.status === true) {
      return {
        status: true,
        message: "Order completed successfully",
        data: res?.data?.data,
      };
    } else {
      return {
        status: false,
        message: "please try again",
      };
    }
  };

  async function getPaymentIntentVerify(
    payment_intent: string,
    type: PAYMENT_INTENT_TYPE
  ) {
    const res = await verifyPaymentOrder(payment_intent);

    if ((res as { data?: { data?: { status: string; metadata?: { connect_id: string } } } })?.data?.data?.status === "succeeded") {
      const resBilling = await refetch();
      const billingData = (resBilling as { data?: { data?: object; status?: boolean } })?.data?.data;
      const validateAddress = validateBillingAddress(billingData);

      if (!validateAddress) {
        toast.error("Invalid billing address!");
        return { status: false, message: "Invalid billing address" };
      } else {
        if ((resBilling as { data?: { status?: boolean } })?.data?.status === true) {
          if (type === "CONNECT_ORDER") {
            const resData = (res as { data: { data: { metadata: { connect_id: string } } } }).data.data;
            return stripePayment(
              {
                ...StripeOrderRequest.getConnectOrderRequest({
                  package_id: resData.metadata.connect_id,
                  payment_method: "STRIPE",
                  payment_id: payment_intent,
                  billing_address: billingData as object,
                }),
              },
              "CONNECT_ORDER"
            );
          }
        }
      }
    } else {
      return {
        status: false,
        message: "Please try again!",
      };
    }
  }

  return { getStripe, getPaymentIntentVerify };
}
