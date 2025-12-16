"use client";

import { useRouter } from "next/navigation";
import store from "@/state/store";
import {
  PreviewsMessageHistory,
  SetActiveUser,
  setNewChatList,
} from "@/state/slices/chat.slice";

export default function useInitChat() {
  const router = useRouter();

  function initChat(user_meta: any, authUser: any) {
    if (user_meta) {
      const obj = {
        user_id: user_meta?.sub || user_meta?.id,
        room_id: "",
        sender_id: authUser?.id,
        receiver_id: user_meta?.sub || user_meta?.id,
        sender_name: authUser?.user_name,
        receiver_name: user_meta?.user_name || user_meta?.name,
        sender_avatar: authUser?.profile_image,
        receiver_avatar: user_meta?.profile_image || user_meta?.avatar,
        sended_at: new Date(),
        last_message: "",
        last_message_status: "",
      };

      store.dispatch(
        PreviewsMessageHistory({ [user_meta?.sub || user_meta?.id]: [] })
      );
      store.dispatch(setNewChatList(obj));
      store.dispatch(SetActiveUser(obj));
      router.push(`/chat`);
    }
    router.push(`/chat`);
  }

  function initPixiChat(user_meta: any, authUser: any) {
    if (user_meta) {
      const obj = {
        user_id: user_meta?.sub || user_meta?.id,
        room_id: "",
        sender_id: authUser?.id,
        receiver_id: user_meta?.sub || user_meta?.id,
        sender_name: authUser?.user_name,
        receiver_name: user_meta?.user_name,
        sender_avatar: authUser?.profile_image,
        receiver_avatar: user_meta?.profile_image,
        sended_at: new Date(),
        last_message: "",
        last_message_status: "",
      };

      store.dispatch(
        PreviewsMessageHistory({ [user_meta?.sub || user_meta?.id]: [] })
      );
      store.dispatch(SetActiveUser(obj));
    }
  }

  return {
    initChat,
    initPixiChat,
  };
}
