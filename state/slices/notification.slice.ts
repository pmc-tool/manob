import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 

const initialState: any = {
  notifications: [],
  unseenTotal: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<any | null>) {
      state.notifications = action.payload.data;
      state.unseenTotal = action.payload.unseen_count;
    },  
    reset(state) {
      return state = initialState;
    }
  },
}); 

export const { setNotifications } = notificationSlice.actions;
 
export default notificationSlice.reducer;
