import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = 0;

const stepSlice = createSlice({
  name: "stepNumber",
  initialState,
  reducers: {
    SetStep(state, action: PayloadAction<Number | null>) { 
      return action.payload;
    }, 
    
  },
});

export const {
  SetStep
} = stepSlice.actions;

export default stepSlice.reducer;
