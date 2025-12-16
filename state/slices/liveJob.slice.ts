import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  currentLiveJobs: [],
  allLiveJobs: [],
  liveJobBids: [],
  newLiveJob: {},
  notificationDeclined: false,
};

const liveJobsSlice = createSlice({
  name: "liveJobs",
  initialState,
  reducers: {
    SetAllLiveJobs(state, action: PayloadAction<string | any>) {
      state.allLiveJobs = action.payload;
    },
    SetNewLiveJob(state, action: PayloadAction<string | any>) {
      state.newLiveJob = action.payload;
    },
    SetCurrentLiveJobs(state, action: PayloadAction<string | any>) {
      state.currentLiveJobs = action.payload;
    },
    SetLiveJobBids(state, action: PayloadAction<string | any>) {
      state.liveJobBids = action.payload;
    },
    SetLiveJobModalDeclined(state, action: PayloadAction<boolean>) {
      state.notificationDeclined = action.payload;
    },
  },
});

export const {
  SetAllLiveJobs,
  SetCurrentLiveJobs,
  SetLiveJobModalDeclined,
  SetNewLiveJob,
  SetLiveJobBids,
} = liveJobsSlice.actions;
export default liveJobsSlice.reducer;
