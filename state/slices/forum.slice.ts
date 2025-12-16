import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 

interface ForumSlice {
  forumList: any[];
  myForumList: any[];
  bookmarkList: any[];
}

const forumInit: ForumSlice = {
  forumList: [],
  myForumList: [],
  bookmarkList: [],
};

const forumSlice = createSlice({
  name: "FORUM",
  initialState: forumInit,
  reducers: {
    SetForumList(state, action: PayloadAction<any>) {
      state.forumList = action.payload;
    },
    SetMyForumList(state, action: PayloadAction<any>) {
      state.myForumList = action.payload;
    },
    SetForumBookmarkList(state, action: PayloadAction<any>) {
      state.bookmarkList = action.payload;
    },

    SetForumSingleCommentIncrease(state, action: PayloadAction<any>) {
      const index = state.forumList.findIndex(
        (item: any) => item.id === action.payload
      );
      if (index !== -1) {
        state.forumList[index].total_comments += 1;
      }
      state.forumList = [...state.forumList];
    },
  },
});

export const {
  SetForumList,
  SetMyForumList,
  SetForumSingleCommentIncrease,
  SetForumBookmarkList,
} = forumSlice.actions;

export default forumSlice.reducer;
