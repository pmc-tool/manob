import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  articles: [],
  recent: [],
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    SetArticles(state, action: PayloadAction<any | null>) {
      state.articles = action.payload;
    },

    SetRecentViewArticles(state, action: PayloadAction<any | null>) {
      if (!action.payload || !action.payload.id) return;

      if (!state.recent) {
        state.recent = [];
      }

      const index = state.recent.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.recent.splice(index, 1);
      }

      state.recent.unshift(action.payload);

      if (state.recent.length > 5) {
        state.recent.pop();
      }
    },
  },
});

export const { SetArticles, SetRecentViewArticles } = supportSlice.actions;

export default supportSlice.reducer;
