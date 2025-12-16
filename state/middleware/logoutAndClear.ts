import { isAnyOf, Middleware } from "@reduxjs/toolkit";
import { LogOut } from "../slices/auth.slice";
import { clearCart } from "../slices/productCart.slice";

export const logoutAndClear: Middleware = (store) => (next) => (action) => {
  console.log('Action received:', action);
  if (isAnyOf(LogOut)(action)) {
    console.log('LogOut action detected, clearing cart...');
    store.dispatch(clearCart());
  }
  return next(action);
};
 