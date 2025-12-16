import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

const draftProductSlice = createSlice({
  name: "draftProduct",
  initialState,
  reducers: {
    SetDraftProduct(state, action: PayloadAction<Object | null>) {
      return action.payload;
    }, 
  },
});

export const {
  SetDraftProduct, 
} = draftProductSlice.actions;

export default draftProductSlice.reducer;
