import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

const draftServiceSlice = createSlice({
  name: "draftService",
  initialState,
  reducers: {
    SetDraftService(state, action: PayloadAction<Object | null>) {
      return action.payload;
    }, 
  },
});

export const {
  SetDraftService, 
} = draftServiceSlice.actions;

export default draftServiceSlice.reducer;
