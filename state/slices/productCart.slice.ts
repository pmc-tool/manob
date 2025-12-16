import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { ProductCartApiService } from "../services/checkout-service/product-cart.service";
import toast from "react-hot-toast";
import { Cookie } from "next/font/google";
import Cookies from "js-cookie";
const isLoginUser =
  typeof window !== "undefined" ? window.localStorage.getItem("p_aut") : null;
// Initial state
const initialState: any = {
  id: "",
  coupon_id: "",
  coupon_code: "",
  total_price: "",
  total_discount: "",
  total_payable: "",
  total_selected_items: "",
  created_at: "",
  updated_at: "",
  cart_items: [],
  total_cart_item: 0,
  isLoading: isLoginUser ? true : false,
  error: null,
};

// Async thunk to fetch cart data
export const fetchCartData = createAsyncThunk<any[], void>(
  "cart/fetchCartData",
  async (_, { dispatch }) => {
    const { data } = await dispatch(
      // ProductCartApiService.endpoints.getCart.initiate()
      ProductCartApiService.endpoints.getCart.initiate(undefined, {
        forceRefetch: true,
      })
    );
    return data?.data;
  }
);

const productCartSlice = createSlice({
  name: "productCart",
  initialState,
  reducers: {
    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item: any) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    setCartItem: (state, action: any) => {
      console.log("fetchCartData fulfilled", action.payload);
      state.id = action.payload.id;
      state.coupon_id = action.payload.coupon_id;
      state.coupon_code = action.payload.coupon_code;
      state.total_price = action.payload.total_price;
      state.total_discount = action.payload.total_discount;
      state.total_payable = action.payload.total_payable;
      state.total_selected_items = action.payload.total_selected_items;
      state.created_at = action.payload.created_at;
      state.updated_at = action.payload.updated_at;
      // state.cart_items = action.payload.cart_items;
      state.cart_items = action.payload.cart_items;
      let total: number = 0;
      if (action?.payload?.total_items > 0) {
        total = action.payload.total_items;
      } else {
        action.payload.cart_items?.forEach((item: any) => {
          total += item.quantity || 0;
        });
      }
      state.total_cart_item = total;
    },
    setCartItems: (state, action: any) => {
      state.id = action.payload.id;
      state.coupon_id = action.payload.coupon_id;
      state.coupon_code = action.payload.coupon_code;
      state.total_price = action.payload.total_price;
      state.total_discount = action.payload.total_discount;
      state.total_payable = action.payload.total_payable;
      state.total_selected_items = action.payload.total_selected_items;
      state.created_at = action.payload.created_at;
      state.updated_at = action.payload.updated_at;
      state.cart_items = action.payload.cart_items;
      let total: number = 0;
      if (action?.payload?.total_items > 0) {
        total = action.payload.total_items;
      } else {
        action.payload.cart_items.map((item: any) => {
          total += item.quantity || 0;
        });
      }
      state.total_cart_item = total;
    },
    clearCart: (state) => {
      return (state = initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action: any) => {
        console.log("fetchCartData fulfilled", action.payload);
        
        if (action.payload?.id) {
          state.isLoading = false;
          state.id = action.payload?.id;
          state.coupon_id = action.payload?.coupon_id;
          state.coupon_code = action.payload?.coupon_code;
          state.total_price = action.payload?.total_price;
          state.total_discount = action.payload?.total_discount;
          state.total_payable = action.payload?.total_payable;
          state.total_selected_items = action.payload?.total_selected_items;
          state.created_at = action.payload?.created_at;
          state.updated_at = action.payload?.updated_at;
          state.cart_items = action.payload?.cart_items;
          let total = 0;
          if (action?.payload?.total_items > 0) {
            total = action.payload.total_items;
          } else {
            action.payload.cart_items.length > 0 &&
              action.payload.cart_items.map((item) => {
                total += item.quantity || 0;
              });
          }
          state.total_cart_item = total;
        } else {
          return (state = initialState);
        }
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch cart data";
      });
  },
});

export const { updateCartItem, setCartItem, setCartItems, clearCart } =
  productCartSlice.actions;

export const incrementCartItem =
  (itemId: string) => async (dispatch: AppDispatch) => {
    const { data } = await dispatch(
      ProductCartApiService.endpoints.incrementCart.initiate(itemId)
    );
    if (data?.statusCode === 200) {
      dispatch(setCartItem(data?.data));
      toast.success("Cart increment successfully!");
    }
  };

export const decrementCartItem =
  (itemId: string) => async (dispatch: AppDispatch) => {
    const { data } = await dispatch(
      ProductCartApiService.endpoints.decrementCart.initiate(itemId)
    );
    if (data?.statusCode === 200) {
      dispatch(setCartItem(data?.data));
      toast.success("Cart decrement successfully!");
    }
  };
export const toggleCheckItem = (itemId: string, checked: boolean) => async (dispatch: AppDispatch) => {
    const { data } = await dispatch(
      ProductCartApiService.endpoints.toggleCheckCart.initiate(itemId)
    );
    if (data?.statusCode === 200) {  
      console.log("toggleCheckItem data", data);
      dispatch(setCartItem(data?.data));
      toast.success(`${checked ? "Checked" : "Unchecked"} Successfully!`);
    }
  };
export const deleteItem = (itemId: string) => async (dispatch: AppDispatch) => {
  const { data } = await dispatch(
    ProductCartApiService.endpoints.itemDelete.initiate(itemId)
  );
  if (data?.statusCode === 200) {
    dispatch(setCartItem(data?.data));
    toast.success("Item deleted successfully!");
  }
};
export const licChangeItem =
  (itemId: string) => async (dispatch: AppDispatch) => {
    const { data } = await dispatch(
      ProductCartApiService.endpoints.licChangeItem.initiate(itemId)
    );
    if (data?.statusCode === 200) {
      dispatch(setCartItem(data?.data));
      toast.success("Item updated successfully!");
    }
  };
export const addCartItem = (item: any) => async (dispatch: AppDispatch) => {
  const { data } = await dispatch(
    ProductCartApiService.endpoints.saveCart.initiate(item)
  );
  if (data?.statusCode === 201) {
    dispatch(setCartItem(data?.data));
    toast.success("Product added to cart successfully!");
  }
};
export const addCartSingleItem =
  (item: any) => async (dispatch: AppDispatch) => {
    const { data } = await dispatch(
      ProductCartApiService.endpoints.saveCartSingleItem.initiate(item)
    );
    if (data?.statusCode === 201) {
      dispatch(setCartItem(data?.data));
      toast.success("Product added to cart successfully!");
    }
  };

export default productCartSlice.reducer;
