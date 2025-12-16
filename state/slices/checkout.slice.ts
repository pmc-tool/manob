import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CheckoutApiService,
  useGetBillingAddressQuery,
} from "../services/checkout-service/checkout.service";
import toast from "react-hot-toast";
import { set } from "date-fns";

interface CheckoutState {
  billingInfo: object;
  packageInfo: {
    id: string;
    connect_count: number;
    tax: number;
    price: number;
    discount: number;
    validity: number;
    validity_type: string;
    total_payable: number;
  };
  serviceInfo: object;
  isSavedBillingInfo: boolean;
  customOffer: object;
  order_type: string;
}
const initialState: CheckoutState = {
  billingInfo: {
    first_name: "",
    last_name: "",
    address_one: "",
    address_two: "",
    city: "",
    country: "",
    zip_code: "",
    email: "",
    notes: "",
  },
  packageInfo: {
    id: "",
    connect_count: 0,
    tax: 0,
    price: 0,
    discount: 0,
    validity: 0,
    validity_type: "MONTH",
    total_payable: 0,
  },
  serviceInfo: {
    is_job_order: false,
    service_id: "",
    job_id: "",
    bid_id: "",
    bid_amount: "",
    service_plan: "",
    quantity: "",
    coupon_id: "",
    coupon_code: "",
    message_id: "",
    room_id: "",
  },
  isSavedBillingInfo: false,
  customOffer: {
    order_type: "CUSTOM_OFFER",
    bid_id: "",
  },
  order_type: "",
};

const checkoutStoreSlice = createSlice({
  name: "checkoutStore",
  initialState,
  reducers: {
    setBillingInfo(state, action: PayloadAction<Object | null>) {
      state.billingInfo = { ...initialState.billingInfo, ...action?.payload };
    },
    setIsSaved(state, action: PayloadAction<any>) {
      state.isSavedBillingInfo = action?.payload;
    },

    setPackageInfo(state, action: PayloadAction<any>) {
      state.packageInfo = { ...initialState.packageInfo, ...action?.payload };
    },
    setServiceInfo(state, action: PayloadAction<Object | null>) {
      sessionStorage.setItem("service_info", JSON.stringify(action?.payload));
      state.serviceInfo = { ...initialState.serviceInfo, ...action?.payload };
    },

    setOrderType(state, action: PayloadAction<string>) {
      state.order_type = action?.payload;
    },

    resetOrderType(state) {
      state.order_type = initialState.order_type;
    },

    setCustomOffer(state, action: PayloadAction<Object | null>) {
      state.customOffer = { ...state.customOffer, bid_id: action?.payload };
    },
    resetServiceInfo(state) {
      state.serviceInfo = initialState.serviceInfo;
    },
    reset(state) {
      return (state = initialState);
    },
  },
});

export const {
  setBillingInfo,
  setIsSaved,
  setPackageInfo,
  setServiceInfo,
  setCustomOffer,
  setOrderType,
  resetOrderType,
  reset,
  resetServiceInfo,
} = checkoutStoreSlice.actions;

export const saveDataBillingAddress =
  (newData: any) => async (dispatch: any, getState: any) => {
    try {
      const result = await dispatch(
        CheckoutApiService.endpoints.saveBillingAddress.initiate(newData)
      ).unwrap();
      if (result?.statusCode === 201) {
        dispatch(setIsSaved(true));
        dispatch(setBillingInfo(result?.data));
        toast.success("Billing address saved successfully!");
      } else {
        toast.error("Failed to save billing address. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save data:", err);
      // Optional: Rollback logic if mutation fails
    }
  };

export default checkoutStoreSlice.reducer;
