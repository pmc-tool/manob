"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FileText, Image as ImageIcon } from "lucide-react";
import { useAppDispatch, useAppStore } from "@/state/hooks";
import {
  SetActiveUser,
  setChatListLastMessageRead,
  setPreviewsMessageHistory,
} from "@/state/slices/chat.slice";
import {
  useLazyGetOneToOneChatHistoryQuery,
  useLazyGetOneToOneHistoryQuery,
} from "@/state/services/chat-service/chat-user-service";
import Avatar from "../shared/avatar/Avatar";
import styles from "./chat.module.css";

interface ChatItemProps {
  room_id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  sender_avatar: string;
  receiver_avatar: string;
  sended_at: string;
  last_message: string;
  last_message_at: string;
  last_message_status: string;
  is_online: boolean;
  activeUser: any;
  sended_by: string;
  attachments: any[];
  is_typing: boolean;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  room_id,
  sender_id,
  receiver_id,
  sender_name,
  receiver_name,
  sender_avatar,
  receiver_avatar,
  sended_at,
  last_message,
  last_message_at,
  last_message_status,
  is_online,
  sended_by,
  activeUser,
  attachments,
  is_typing,
  onClick,
}) => {
  const user = useSelector((state: any) => state.auth.userInfo);
  const userActive = user?.id === sender_id ? receiver_id : sender_id;

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return "";
    if (avatar.includes("https://") || avatar.includes("http://")) {
      return avatar;
    }
    return `${process.env.NEXT_PUBLIC_S3BUCKET}/${avatar}`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  const isSeen = last_message_status === "READ" || user?.id === sended_by;

  return (
    <div
      className={`${styles.chatItem} ${
        activeUser?.receiver_id === userActive ? styles.active : ""
      } ${isSeen ? styles.seen : styles.unseen}`}
      id={room_id}
      onClick={onClick}
    >
      <div className={styles.avatarWrapper}>
        <Avatar
          avatar={getAvatarUrl(receiver_avatar)}
          username={receiver_name}
          size={48}
        />
        <span
          className={`${styles.status} ${
            is_online ? styles.online : styles.offline
          }`}
        />
      </div>

      <div className={styles.infoText}>
        <div className={styles.nameRow}>
          <h5>{receiver_name}</h5>
          <span className={styles.time}>{formatTime(last_message_at)}</span>
        </div>
        <p className={styles.lastMessage}>
          {is_typing ? (
            <i className={styles.typing}>Typing...</i>
          ) : last_message === "" && attachments?.length > 0 ? (
            <>
              {attachments[attachments.length - 1]?.mimetype?.includes(
                "image"
              ) ? (
                <ImageIcon className={styles.attachIcon} size={14} />
              ) : (
                <FileText className={styles.attachIcon} size={14} />
              )}
              <span>{attachments[attachments.length - 1]?.filename}</span>
            </>
          ) : (
            last_message
          )}
        </p>
      </div>
    </div>
  );
};

interface ChatListProps {
  chats: Record<string, any>;
  title?: string;
  onTabClick: () => void;
  getSelectedUserData: (id: string) => void;
  newChatList?: any;
  chatOpsList?: any;
}

export default function ChatList({
  chats,
  title = "Recent Chat",
  onTabClick,
  getSelectedUserData,
  newChatList,
  chatOpsList,
}: ChatListProps) {
  const [chatList, setChatList] = useState<any>(chats);
  const [previewsHistory] = useLazyGetOneToOneHistoryQuery();
  const [previewsChatHistory] = useLazyGetOneToOneChatHistoryQuery();
  const store = useAppStore();
  const dispatch = useAppDispatch();

  const user = useSelector((state: any) => state.auth.userInfo);
  const activeUser = useSelector((state: any) => state.chatStore.active_user);
  const chatListData = useSelector((state: any) => state.chatStore.chat_list);

  const setActiveUser = (user: any) => {
    store.dispatch(SetActiveUser(user));
  };

  useEffect(() => {
    const chatsArray = Object.entries(chats).map(([key, value]: [string, any]) => ({
      key,
      ...value,
    }));

    const newList = [...chatsArray];

    const reorderedChats = Object.fromEntries(
      newList.map(({ key, ...value }) => [key, value])
    );

    if (
      activeUser &&
      reorderedChats[activeUser?.user_id]?.last_message_status !== "READ" &&
      user?.id !== reorderedChats[activeUser?.user_id]?.sended_by
    ) {
      store.dispatch(setChatListLastMessageRead(activeUser?.user_id));
    }

    setChatList(reorderedChats);
    onTabClick();
  }, [chats]);

  async function getUserChatList(chat: any) {
    setActiveUser({
      user_id: user.id === chat.sender_id ? chat.receiver_id : chat.sender_id,
      room_id: chat.room_id,
      sender_id: chat.sender_id,
      receiver_id: chat.receiver_id,
      sender_name: chat.sender_name,
      receiver_name: chat.receiver_name,
      sender_avatar: chat.sender_avatar,
      receiver_avatar: chat.receiver_avatar,
      sended_at: chat.last_message_at,
      sended_by: chat.sended_by,
      last_message: chat.last_message,
      last_message_status: chat.last_message_status,
    });

    const userId =
      user.id === chat.sender_id ? chat.receiver_id : chat.sender_id;

    if (chat.last_message_status !== "READ" && user.id !== chat.sended_by) {
      store.dispatch(setChatListLastMessageRead(userId));
    }

    if (chat.room_id) {
      getSelectedUserData(chat.room_id);
      onTabClick();
    }
  }

  // Pixi AI ID to filter out from the main list
  const PIXI_ID = "bc6c40c2-625b-49b2-b46a-39b7b0e54634";

  return (
    <>
      <h2 className={styles.chatListTitle}>{title}</h2>
      <div className={styles.chatListItems}>
        {Object.keys(newChatList || {}).length !== 0 && (
          <ChatItem
            {...newChatList}
            onClick={() => {
              getUserChatList(newChatList);
            }}
            activeUser={activeUser}
          />
        )}
        {Object.keys(chatList).map((chat: string) => (
          <React.Fragment key={chat}>
            {chatList[chat].receiver_id !== PIXI_ID && (
              <ChatItem
                {...chatList[chat]}
                onClick={() => {
                  getUserChatList(chatList[chat]);
                }}
                activeUser={activeUser}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
