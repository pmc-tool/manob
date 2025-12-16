import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UChat {
  id: string;
  message: any[];
}

interface ImgChat {
  type: string;
  message: any[];
}

interface DocChat {
  type: string;
  message: any[];
}

interface ChatState {
  active_user: any;
  chat_history: Record<string, any>;
  chat_list: Record<string, any>;
  chat_ops: Record<string, any>;
  new_chat: Record<string, any>;
  image_attachment: ImgChat[];
  doc_attachment: DocChat[];
  connected: boolean;
  recent_chat: any[];
  active_user_status: any;
  user_from_nav: any;
  pixi: null;
}

const initialState: ChatState = {
  active_user: null,
  chat_history: {},
  chat_list: {},
  chat_ops: {},
  new_chat: {},
  image_attachment: [],
  doc_attachment: [],
  connected: true,
  recent_chat: [],
  active_user_status: {},
  user_from_nav: "",
  pixi: null,
};

const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    SetActiveUser(state, action: PayloadAction<any>) {
      state.active_user = action.payload;
    },

    AppendMeesageHistory(state, action: PayloadAction<any>) {
      const chat = state.chat_history[action.payload.receiver_id] || [];
      console.log("AppendMeesageHistory", action.payload);
      console.log("AppendMeesageHistory", chat);

      let newMessage: any = [];
      if (chat?.length > 0) {
        const message = [...chat];
        newMessage = [...message, action.payload];
        state.chat_history[action.payload.receiver_id] = newMessage;
      } else {
        state.chat_history[action.payload.receiver_id].push(action.payload);
      }
    },

    AppendRecievedMessage(state, action: PayloadAction<any>) {
      const chat = state.chat_history[action.payload.sender_id];
      let newMessage: any = [];
      if (chat && chat.length > 0) {
        let message = [...chat];
        newMessage = [...message, action.payload];
        state.chat_history[action.payload.sender_id] = newMessage;
        state.chat_list[action.payload.sender_id].is_typing = false;
      } else {
        if (
          Object.hasOwnProperty(state.chat_history[action.payload.sender_id])
        ) {
          state.chat_history[action.payload.sender_id].push(action.payload);
        } else {
          state.chat_history = {
            ...state.chat_history,
            ...{
              [action.payload.sender_id]: [action.payload],
            },
          };
        }
      }
    },

    setPreviewsMessageHistory(state, action: PayloadAction<any>) {
      state.chat_history[state.active_user.receiver_id] = action?.payload;
    },

    setPreviewsPaginationMessageHistory(state, action: PayloadAction<any>) {
      const receiverId = state.active_user.receiver_id;

      const prevData = [...state.chat_history[receiverId]];

      state.chat_history[receiverId] = [...action.payload, ...prevData];
    },

    PreviewsMessageHistory(state, action: PayloadAction<any>) {
      state.chat_history = {
        ...state.chat_history,
        ...action.payload,
      };
    },

    SetImageAttachment(state, action: PayloadAction<any>) {
      state.image_attachment = [...state.image_attachment, action.payload];
    },

    removeImageAttachment(state, action: PayloadAction<any>) {
      const files = [...state.image_attachment];
      files.splice(action.payload, 1);
      state.image_attachment = files;
    },

    SetDocAttachment(state, action: PayloadAction<any>) {
      state.doc_attachment = [...state.doc_attachment, action.payload];
    },

    removeDocAttachment(state, action: PayloadAction<any>) {
      const files = [...state.doc_attachment];
      files.splice(action.payload, 1);
      state.doc_attachment = files;
    },

    resetImageAttachment(state) {
      state.image_attachment = [];
    },
    resetDocAttachment(state) {
      state.doc_attachment = [];
    },
    resetNewChat(state) {
      state.new_chat = {};
    },
    setChatConnect(state, action: PayloadAction<any>) {
      state.connected = action.payload;
    },

    setChatList(state: any, action: PayloadAction<any>) {
      // if (action.payload["bc6c40c2-625b-49b2-b46a-39b7b0e54634"]) {
      //   state.pixi = action.payload["bc6c40c2-625b-49b2-b46a-39b7b0e54634"];
      //   delete action.payload["bc6c40c2-625b-49b2-b46a-39b7b0e54634"];
      // }
      state.pixi = action.payload["bc6c40c2-625b-49b2-b46a-39b7b0e54634"];
      state.chat_list = action.payload;
    },

    setChatOps(state: any, action: PayloadAction<any>) {
      state.chat_ops = action.payload;
    },
    setChatListLastMessageRead(state: any, action: PayloadAction<any>) {
      if (
        state.chat_list[action.payload] &&
        state.chat_list[action.payload]?.last_message_status !== "READ"
      ) {
        state.chat_list[action.payload].last_message_status = "READ";
      }
    },
    setNewChatList(state, action: PayloadAction<any>) {
      state.new_chat = action.payload;
    },

    resetChatList(state) {
      state.chat_list = {};
    },

    setRecentChatList(state, action: PayloadAction<any>) {
      state.recent_chat = action.payload;
    },

    addNewRecentChat(state, action: PayloadAction<any>) {
      const data: any = [...state.recent_chat];
      const index = data.findIndex(
        (item: any) => item.sender_id === action.payload.sender_id
      );
      if (index > -1) {
        data.splice(index, 1);
      } else {
        data.pop();
      }
      data.unshift(action.payload);
      state.recent_chat = data;
    },

    // set the status as read after select the chat from navbar
    setRecentChatReadStatus(state, action: PayloadAction<any>) {
      const data: any = [...state.recent_chat];
      const index = data.findIndex(
        (item: any) => item.receiver_id === action.payload
      );

      data[index].last_message_status = "READ";
      state.recent_chat = data;
    },

    addActiveUSerStatus(state, action: PayloadAction<any>) {
      state.active_user_status = action.payload;
    },

    setActiveUserNav(state, action: PayloadAction<any>) {
      const senderId = action.payload;
      state.active_user = {
        ...state.chat_list[senderId],
        user_id: state.chat_list[senderId]?.receiver_id,
      };
    },

    resetAllChatData: () => initialState,

    changeTypeState(state, action: PayloadAction<any>) {
      const user: any = Object.values(state.chat_list).filter(
        (item: any) => item.room_id === action.payload.room_id
      );

      state.chat_list[user[0].receiver_id].is_typing = action.payload.typing;
    },
  },
});

export const {
  SetActiveUser,
  AppendMeesageHistory,
  AppendRecievedMessage,
  setPreviewsMessageHistory,
  setPreviewsPaginationMessageHistory,
  PreviewsMessageHistory,
  SetImageAttachment,
  removeImageAttachment,
  SetDocAttachment,
  removeDocAttachment,
  resetNewChat,
  resetImageAttachment,
  resetDocAttachment,
  setChatConnect,
  setChatList,
  setChatOps,
  setChatListLastMessageRead,
  setNewChatList,
  resetChatList,
  resetAllChatData,
  setRecentChatList,
  setRecentChatReadStatus,
  addNewRecentChat,
  addActiveUSerStatus,
  setActiveUserNav,
  changeTypeState,
} = chatSlice.actions;

export default chatSlice.reducer;
