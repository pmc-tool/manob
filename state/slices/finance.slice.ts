import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { FinanceApiService } from "../services/seller-service/finance.service";

const initialState: any = {
  paymentMethodFormValues: {}
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setPaymentMethodFormValues(state, action: PayloadAction<Object | null>) {
      state.paymentMethodFormValues = action.payload;
    }, 
    
    reset(state) {
      return state = initialState;
    }
  },
}); 

export const { setPaymentMethodFormValues } = financeSlice.actions;

const saveMethod = (item: any) => (dispatch: AppDispatch) => {
  dispatch(FinanceApiService.endpoints.saveMethod.initiate(item));
} 

export default financeSlice.reducer;
