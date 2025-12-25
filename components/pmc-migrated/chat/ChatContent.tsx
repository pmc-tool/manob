"use client";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketProvider";
import { useAppSelector } from "@/state/hooks";
import {
  useUpdateCustomOfferMutation,
  useWithdrawCustomOfferMutation,
} from "@/state/services/chat-service/chat-custom-order.service";
import { useLazyGetOneToOneChatHistoryQuery } from "@/state/services/chat-service/chat-user-service";
import {
  changeTypeState,
  setPreviewsMessageHistory,
  setPreviewsPaginationMessageHistory,
} from "@/state/slices/chat.slice";
import {
  setCustomOffer,
  setOrderType,
  setServiceInfo,
} from "@/state/slices/checkout.slice";
import store from "@/state/store";
import Avatar from "../shared/avatar/Avatar";
import ChatText from "./ChatText";
import ChatAgentText from "./ChatAgentText";
import CommonAttachment from "./CommonAttachment";
import OrderRequest from "./OrderRequest";
import ChatOrderRequest from "./ChatOrderRequest";
import styles from "./chat.module.css";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface ChatContentProps {
  isEmptyContentVisible: boolean;
}

export default function ChatContent({
  isEmptyContentVisible,
}: ChatContentProps) {
  const { chat_history, new_chat, active_user, chat_list }: any = useAppSelector(
    (state) => state.chatStore
  );

  const authUser: any = useAppSelector((state) => state.auth.userInfo);
  const [withdrawCustomOffer] = useWithdrawCustomOfferMutation();
  const [updateCustomOffer] = useUpdateCustomOfferMutation();
  const router = useRouter();
  const socket = useSocket();

  const divRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previewsChatHistory] = useLazyGetOneToOneChatHistoryQuery();

  const currentPageRef = useRef(1);
  const hasScrolledInitially = useRef<{ [userId: string]: boolean }>({});
  const prevUserId = useRef<string | null>(null);

  const scrollToBottom = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  };

  const isAtBottom = () => {
    if (!divRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = divRef.current;
    return scrollHeight - scrollTop - clientHeight <= 350;
  };

  useEffect(() => {
    const userId = active_user?.user_id;
    const currentChat = chat_history[userId];

    if (!userId || !currentChat) return;

    if (prevUserId.current !== userId) {
      prevUserId.current = userId;
      hasScrolledInitially.current[userId] = false;
    }

    if (!hasScrolledInitially.current[userId]) {
      scrollToBottom();
      hasScrolledInitially.current[userId] = true;
      return;
    }

    if (isAtBottom()) {
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [
    chat_history[active_user?.user_id],
    new_chat,
    chat_list[active_user?.user_id]?.is_typing,
    active_user?.user_id,
  ]);

  const handleScroll = () => {
    if (divRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divRef.current;
      const isAtBottomCheck = scrollHeight - scrollTop <= clientHeight + 200;
      setShowScrollToBottom(!isAtBottomCheck);

      if (scrollTop === 0 && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  };

  useEffect(() => {
    const container = divRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    currentPageRef.current = 1;
  }, [active_user?.user_id]);

  const loadMoreMessages = async () => {
    const state = store.getState();
    const chatHistoryState = state.chatStore.chat_history;
    const activeUserState = state.chatStore.active_user;

    if (chatHistoryState[activeUserState?.user_id]?.length >= 50) {
      if (isLoadingMore) return;
      setIsLoadingMore(true);

      const prevScrollHeight = divRef.current?.scrollHeight ?? 0;
      const nextPage = currentPageRef.current + 1;

      const res: any = await previewsChatHistory({
        id: activeUserState.room_id,
        page: nextPage,
      });

      if (res?.data?.status === true) {
        const data = [...res?.data?.data].reverse();
        if (data.length === 0) {
          setIsLoadingMore(false);
          return;
        }
        await store.dispatch(setPreviewsPaginationMessageHistory(data));

        const newScrollHeight = divRef.current?.scrollHeight ?? 0;
        if (divRef.current) {
          divRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }

        currentPageRef.current = nextPage;
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  function getToCheckout(data: any, message_id: string, room_id: string): void {
    store.dispatch(setCustomOffer(data?.id));
    store.dispatch(
      setServiceInfo({
        service_id: data?.service_id,
        is_job_order: false,
        bid_id: data?.id,
        job_id: "",
        bid_amount: data?.price,
        message_id,
        room_id,
      })
    );
    store.dispatch(setOrderType("CUSTOM_OFFER"));
    sessionStorage.setItem("o_t", "CUSTOM_OFFER");
    router.push(`/job-payment`);
  }

  const handleWithdrawCustomOffer = async (
    orderId: string,
    messageId: string,
    roomId: string
  ) => {
    try {
      const response: any = await withdrawCustomOffer(orderId);
      if (response.data.status === true) {
        await socket?.emit("updateCustomOffer", {
          message_id: messageId,
          room_id: roomId,
          status: "WITHDRAW",
        });
      }
    } catch (error) {
      console.error("Error withdrawing custom offer:", error);
    }
  };

  useEffect(() => {
    socket?.on("updateCustomOffer", (data: any) => {
      updateOrderMessageStatusState(data.message_id, data.message_data.status);
    });
    return () => {
      socket?.off("updateCustomOffer");
    };
  }, [socket]);

  const handleMessageRead = useCallback(
    (data: any) => {
      const roomId = data?.room_id;
      const activeRoomId = active_user?.room_id;

      if (roomId === activeRoomId && active_user?.user_id) {
        const userChatHistory = chat_history[active_user.user_id];
        if (!userChatHistory) return;

        let foundRead = false;
        const chatData = [...userChatHistory]
          .reverse()
          .map((msg: any) => {
            if (msg.sended_by !== msg.sender_id) return msg;
            if (foundRead || msg.status === "READ") {
              foundRead = true;
              return msg;
            }
            return { ...msg, status: "READ" };
          })
          .reverse();

        store.dispatch(setPreviewsMessageHistory(chatData));
      }
    },
    [active_user?.room_id, active_user?.user_id, chat_history]
  );

  useEffect(() => {
    socket?.on("messageReaded", handleMessageRead);
    return () => {
      socket?.off("messageReaded", handleMessageRead);
    };
  }, [handleMessageRead, socket]);

  useEffect(() => {
    if (
      active_user?.user_id &&
      chat_list[active_user?.user_id] &&
      chat_list[active_user?.user_id]?.sended_by !==
        chat_list[active_user?.user_id]?.sender_id
    ) {
      socket?.emit("messageReaded", {
        room_id: active_user?.room_id,
      });
    }
  }, [chat_history, active_user?.user_id, active_user?.room_id, chat_list, socket]);

  async function handleRejectCustomOffer(messageId: string, roomId: string) {
    await socket?.emit("updateCustomOffer", {
      message_id: messageId,
      room_id: roomId,
      status: "REJECTED",
    });
  }

  function updateOrderMessageStatusState(mId: string, status: string) {
    const state = store.getState();
    const chatHistoryState = state.chatStore.chat_history;
    const activeUserState = state.chatStore.active_user;

    const updatedChatHistory = chatHistoryState[activeUserState?.user_id]?.map(
      (chat: any) => {
        if (
          chat.message_type === "ORDER" &&
          chat.message_id === mId &&
          chat.message_data.status === "PENDING"
        ) {
          return {
            ...chat,
            message_data: { ...chat.message_data, status },
          };
        }
        return chat;
      }
    );

    if (Array.isArray(updatedChatHistory)) {
      store.dispatch(setPreviewsMessageHistory(updatedChatHistory));
    }
  }

  const formatDateLabel = (dateString: string) => {
    const date = dayjs(dateString);
    if (date.isToday()) return "Today";
    if (date.isYesterday()) return "Yesterday";
    return date.format("MMMM D, YYYY");
  };

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return "";
    if (avatar.includes("https://") || avatar.includes("http://")) {
      return avatar;
    }
    return `${process.env.NEXT_PUBLIC_S3BUCKET}/${avatar}`;
  };

  const groupedByDate: Record<string, any[]> = {};
  (chat_history[active_user?.user_id] || []).forEach((msg: any) => {
    const dateKey = dayjs(msg.sended_at).format("YYYY-MM-DD");
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(msg);
  });

  return (
    <>
      <div className={styles.messageContentInner} ref={divRef}>
        {isLoadingMore && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        {Object.entries(groupedByDate).map(([dateKey, messages], i) => {
          const dateLabel = formatDateLabel(dateKey);

          const groupedMessages = messages.reduce<
            { sender_id: string; messages: any[] }[]
          >((acc, curr) => {
            const last = acc[acc.length - 1];
            if (last && last.sender_id === curr.sender_id) {
              last.messages.push(curr);
            } else {
              acc.push({ sender_id: curr.sender_id, messages: [curr] });
            }
            return acc;
          }, []);

          return (
            <React.Fragment key={i}>
              <div className={styles.dateLabel}>
                <hr />
                <span>{dateLabel}</span>
                <hr />
              </div>
              {groupedMessages.map((group, j) => {
                const isSelf = group.sender_id === authUser?.id;
                return (
                  <div
                    className={`${styles.message} ${isSelf ? styles.me : ""}`}
                    key={j}
                  >
                    {!isSelf && (
                      <Avatar
                        avatar={getAvatarUrl(active_user?.receiver_avatar)}
                        username={active_user?.receiver_name}
                        size={42}
                        className={styles.messageAvatar}
                      />
                    )}
                    <div className={styles.textMain}>
                      <div className={styles.textGroup}>
                        {group.messages.map((chat: any, k: number) => (
                          <React.Fragment key={k}>
                            {chat.attachments?.length > 0 && (
                              <CommonAttachment
                                chatAttachments={chat.attachments}
                                sendingTime={chat.sended_at}
                                isSelf={isSelf}
                                isSeen={chat.status}
                              />
                            )}
                            {chat.message &&
                              chat.message_type !== "ORDER" &&
                              chat.message_type !== "AGENT" && (
                                <ChatText
                                  message={chat.message}
                                  sendingTime={chat.sended_at}
                                  isSelf={isSelf}
                                  isSeen={chat.status}
                                />
                              )}
                            {chat.message_type === "AGENT" && (
                              <ChatAgentText
                                message={chat.message_data?.text || chat.message}
                                sendingTime={chat.sended_at}
                                authUser={authUser}
                              />
                            )}
                            {chat.message_type === "ORDER" &&
                              (isSelf ? (
                                <OrderRequest
                                  service_id={chat.message_data?.service_id}
                                  imageSrc={`${process.env.NEXT_PUBLIC_S3BUCKET}/${chat.message_data?.service_meta?.thumbnail_image}`}
                                  title={
                                    chat.message_data?.service_meta?.service_title
                                  }
                                  description={chat.message_data?.cover_letter}
                                  price={chat.message_data?.price}
                                  reviews={{ rating: 4.82, count: 94 }}
                                  revision={chat.message_data?.revisions}
                                  deliveryTime={`${chat.message_data?.delivery_time} ${chat.message_data?.delivery_type}`}
                                  sendingTime={chat.sended_at}
                                  isSeen={chat.status}
                                  isSelf={isSelf}
                                  handleWithdrawCustomOffer={() =>
                                    handleWithdrawCustomOffer(
                                      chat.message_data?.id,
                                      chat.message_id,
                                      active_user.room_id
                                    )
                                  }
                                  cus_order_status={chat.message_data?.status}
                                />
                              ) : (
                                <ChatOrderRequest
                                  service_id={chat.message_data?.service_id}
                                  imageSrc={`${process.env.NEXT_PUBLIC_S3BUCKET}/${chat.message_data?.service_meta?.thumbnail_image}`}
                                  productTitle={
                                    chat.message_data?.service_meta?.service_title
                                  }
                                  productDescription={
                                    chat.message_data?.cover_letter
                                  }
                                  price={chat.message_data?.price}
                                  revision={chat.message_data?.revisions}
                                  deliveryTime={`${chat.message_data?.delivery_time} ${chat.message_data?.delivery_type}`}
                                  reviews={{ rating: 4.82, count: 94 }}
                                  sendingTime={chat.sended_at}
                                  onReject={() =>
                                    handleRejectCustomOffer(
                                      chat.message_id,
                                      active_user.room_id
                                    )
                                  }
                                  onAccept={() =>
                                    getToCheckout(
                                      chat.message_data,
                                      chat.message_id,
                                      active_user.room_id
                                    )
                                  }
                                  cus_order_status={chat.message_data?.status}
                                />
                              ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
        {chat_list[active_user?.user_id]?.is_typing && (
          <div className={styles.message}>
            <Avatar
              avatar={getAvatarUrl(active_user?.receiver_avatar)}
              username={active_user?.receiver_name}
              size={42}
              className={styles.messageAvatar}
            />
            <div className={styles.textMain}>
              <div className={styles.textGroup}>
                <div className={`${styles.text} ${styles.typing}`}>
                  <div className={styles.wave}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className={styles.scrollBottomBtn}
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={18} />
        </button>
      )}
    </>
  );
}
