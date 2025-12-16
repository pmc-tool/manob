"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Grid3X3,
  Info,
  MessageSquare,
  WifiOff,
  ChevronRight,
  Maximize,
  Minimize,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "@/context/SocketProvider";
import { useAppSelector, useAppStore } from "@/state/hooks";
import {
  SetActiveUser,
  setPreviewsMessageHistory,
  resetNewChat,
  setChatListLastMessageRead,
} from "@/state/slices/chat.slice";
import { useLazyGetOneToOneChatHistoryQuery } from "@/state/services/chat-service/chat-user-service";
import { useLazyGetUserPublicProfileQuery } from "@/state/services/home-service/public-user.service";
import { calculateTimeAgo } from "@/utils/dateFormat";
import { PixiInitiateObject } from "@/constent/pixi";
import useInitChat from "@/hooks/useInitChat";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import MessageInput from "./MessageInput";
import UserInfoSidebar from "./UserInfoSidebar";
import ChatAttachmentContent from "./ChatAttachmentContent";
import ChatAttachmentDocContent from "./ChatAttachmentDocContent";
import styles from "./chat.module.css";
import store from "@/state/store";

interface ChatAppProps {
  style?: React.CSSProperties;
}

export default function ChatApp({ style }: ChatAppProps) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isInfoSidebarActive, setIsInfoSidebarActive] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<any>([]);
  const [attachmentDocFiles, setAttachmentDocFiles] = useState<any>([]);
  const [isEmptyContentVisible, setIsEmptyContentVisible] = useState(true);
  const [chatListAutoHeight, setChatListAutoHeight] = useState("100%");
  const [filteredChatList, setFilteredChatList] = useState<any[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dispatch = useDispatch();
  const socket = useSocket();
  const appStore = useAppStore();

  const authUser = useSelector((state: any) => state.auth.userInfo);
  const { connected, chat_list: chatUserList, chat_ops: chatOpsList, pixi, new_chat: newChat } = useSelector(
    (state: any) => state.chatStore
  );

  const chatActiveUser = useAppSelector((state) => state.chatStore.active_user);
  const lastActive = useAppSelector((state) => state.chatStore.active_user_status);
  const activeUser = useSelector((state: any) => state.chatStore.active_user);

  const [getUserById, { data: userById }] = useLazyGetUserPublicProfileQuery();
  const [previewsChatHistory] = useLazyGetOneToOneChatHistoryQuery();

  const tabContentRef = useRef<HTMLDivElement>(null);
  const chatSidebarHeaderRef = useRef<HTMLDivElement>(null);

  const { initPixiChat } = useInitChat();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsSidebarActive(false);
    if (chatActiveUser?.user_id) {
      getUserById({ id: chatActiveUser.user_id, type: "SELLER" });
    }
  }, [chatActiveUser]);

  useEffect(() => {
    socket?.emit("chatHistory", {});
  }, [socket]);

  useEffect(() => {
    const calculateHeight = () => {
      const topHeaderHeight = document.getElementById("chatSidebarHeader")?.offsetHeight || 0;
      setChatListAutoHeight(`calc(100% - ${topHeaderHeight}px)`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  useEffect(() => {
    if (Object.keys(newChat).length > 0) {
      if (chatUserList[newChat.receiver_id]) {
        const objectActiveUser = { ...chatUserList[newChat.receiver_id] };
        objectActiveUser.user_id = newChat.receiver_id;
        store.dispatch(SetActiveUser(objectActiveUser));
        store.dispatch(resetNewChat());
        getSelectedUserData(chatUserList[newChat.receiver_id].room_id);
      } else {
        store.dispatch(SetActiveUser(newChat));
      }
      handleTabClick();
    }
  }, [newChat, chatUserList]);

  useEffect(() => {
    if (activeUser?.room_id) {
      getSelectedUserData(chatUserList[activeUser.receiver_id]?.room_id);
      handleTabClick();
    }
  }, [activeUser]);

  useEffect(() => {
    return () => {
      dispatch(SetActiveUser(null));
    };
  }, [dispatch]);

  useEffect(() => {
    const tabContentEl = tabContentRef.current;
    const headerEl = chatSidebarHeaderRef.current;

    const handleScroll = () => {
      if (tabContentEl && headerEl) {
        if (tabContentEl.scrollTop > 0) {
          headerEl.classList.add(styles.chatHeaderShadow);
        } else {
          headerEl.classList.remove(styles.chatHeaderShadow);
        }
      }
    };

    tabContentEl?.addEventListener("scroll", handleScroll);
    return () => tabContentEl?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleButtonClick = () => setIsSidebarActive(true);
  const handleOverlayClick = () => {
    setIsSidebarActive(false);
    setIsInfoSidebarActive(false);
  };
  const infoSidebarToggle = () => setIsInfoSidebarActive(true);

  const handleTabClick = () => {
    if (chatActiveUser || Object.keys(newChat).length > 0) {
      setIsEmptyContentVisible(false);
    }
    setIsSidebarActive(false);
  };

  async function getSelectedUserData(roomId: string, page = 1) {
    if (!roomId) return;
    const res: any = await previewsChatHistory({ id: roomId, page });
    if (res?.data?.status === true) {
      const data = [...res?.data?.data].reverse();
      store.dispatch(setPreviewsMessageHistory(data));
    }
  }

  function getAttachment(values: any) {
    if (values[0]?.type?.includes("image")) {
      setAttachmentFiles([...attachmentFiles, { type: "image", message: values[0] }]);
    } else {
      setAttachmentDocFiles([...attachmentDocFiles, { type: "doc", documents: values[0] }]);
    }
  }

  const removeAttachmentFile = (index: number) => {
    const attachments = [...attachmentFiles];
    attachments.splice(index, 1);
    setAttachmentFiles(attachments);
  };

  const removeAttachmentDocFile = (index: number) => {
    const doc = [...attachmentDocFiles];
    doc.splice(index, 1);
    setAttachmentDocFiles(doc);
  };

  const setPixiAsUser = async () => {
    if (!pixi) {
      initPixiChat(PixiInitiateObject, authUser);
      handleTabClick();
    } else {
      const activePixi = {
        user_id: authUser?.id === pixi?.sender_id ? pixi?.receiver_id : pixi?.sender_id,
        room_id: pixi?.room_id,
        sender_id: pixi?.sender_id,
        receiver_id: pixi?.receiver_id,
        sender_name: pixi?.sender_name,
        receiver_name: pixi?.receiver_name,
        sender_avatar: pixi?.sender_avatar,
        receiver_avatar: pixi?.receiver_avatar,
        sended_at: pixi?.sended_at,
        last_message: pixi?.last_message,
        last_message_status: pixi?.last_message_status,
      };
      store.dispatch(SetActiveUser(activePixi));
      if (pixi?.room_id) {
        const res: any = await previewsChatHistory({ id: pixi.room_id, page: 1 });
        if (res?.data?.status === true) {
          const data = [...res?.data?.data].reverse();
          store.dispatch(setPreviewsMessageHistory(data));
        }
      }
      handleTabClick();
    }
  };

  const searchPeopleGroups = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length) {
      const filtered: any = Object.values(chatUserList).filter((item: any) => {
        const receiverName = item.receiver_name?.toLowerCase() || "";
        return receiverName.includes(value.toLowerCase());
      });
      setFilteredChatList(filtered);
    } else {
      setFilteredChatList([]);
    }
  };

  if (!isClient) return null;

  return (
    <div className={styles.chatContainerWrap} style={style}>
      <div className={styles.chatContainer}>
        {/* Chat List Sidebar */}
        <div className={`${styles.chatSidebar} ${isSidebarActive ? styles.active : ""}`}>
          <div id="chatSidebarHeader" ref={chatSidebarHeaderRef} className={styles.sidebarHeader}>
            {/* Search */}
            <div className={styles.chatSearch}>
              <input
                type="search"
                placeholder="Search by name"
                maxLength={30}
                onChange={searchPeopleGroups}
              />
              <button type="button" className={styles.searchBtn}>
                <Search size={16} />
              </button>
            </div>

            {/* Connection warning */}
            {!connected && (
              <div className={styles.reconnectingInfo}>
                <div className={styles.reconnectingIcon}>
                  <WifiOff size={24} />
                </div>
                <div className={styles.reconnectingText}>
                  <h6>Computer not connected</h6>
                  <p>
                    Make sure your computer has an active internet connection.{" "}
                    <Link href="" className={styles.reconnectLink}>
                      Reconnect <ChevronRight size={12} />
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Pixi AI Button */}
            <div className={styles.pixiButtonWrapper}>
              <button type="button" className={styles.pixiButton} onClick={setPixiAsUser}>
                Talk to PMC Pixi AI
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0766 13.8253C10.0481 13.7137 9.97982 13.6163 9.88464 13.5514C9.78946 13.4865 9.67389 13.4586 9.55957 13.4728C9.13865 13.519 8.71559 13.5431 8.29215 13.5449C6.65473 13.5432 5.08489 12.8919 3.92706 11.7341C2.76923 10.5763 2.11798 9.00642 2.1162 7.369V5.47711C2.1162 5.07908 2.27432 4.69736 2.55576 4.41591C2.83721 4.13446 3.21894 3.97635 3.61696 3.97635H13.3736C13.7716 3.97635 14.1533 4.13446 14.4348 4.41591C14.7162 4.69736 14.8743 5.07908 14.8743 5.47711V6.89897C14.8743 7.02363 14.9239 7.14319 15.012 7.23133C15.1002 7.31948 15.2197 7.369 15.3444 7.369H16.083C16.2077 7.369 16.3272 7.31948 16.4154 7.23133C16.5035 7.14319 16.553 7.02363 16.553 6.89897V5.47711C16.553 4.63386 16.2181 3.82515 15.6218 3.22889C15.0255 2.63262 14.2168 2.29765 13.3736 2.29765H9.33462V0.75324C9.33462 0.628578 9.2851 0.509023 9.19695 0.420874C9.1088 0.332725 8.98925 0.283203 8.86458 0.283203H8.12596C8.00129 0.283203 7.88174 0.332725 7.79359 0.420874C7.70544 0.509023 7.65592 0.628578 7.65592 0.75324V2.29765H3.61696C2.77372 2.29765 1.96501 2.63262 1.36874 3.22889C0.772478 3.82515 0.4375 4.63386 0.4375 5.47711V7.369C0.439722 9.4515 1.26798 11.4481 2.74053 12.9206C4.21308 14.3932 6.20965 15.2214 8.29215 15.2237C8.81737 15.2224 9.34206 15.1899 9.86341 15.1263C9.92818 15.1171 9.99032 15.0944 10.0459 15.0599C10.1014 15.0254 10.1492 14.9797 10.1861 14.9257C10.2231 14.8717 10.2484 14.8106 10.2605 14.7463C10.2725 14.682 10.2711 14.6159 10.2562 14.5522L10.0766 13.8253Z" fill="white" />
                  <path d="M5.80781 9.0121C6.5495 9.0121 7.15077 8.41083 7.15077 7.66913C7.15077 6.92744 6.5495 6.32617 5.80781 6.32617C5.06611 6.32617 4.46484 6.92744 4.46484 7.66913C4.46484 8.41083 5.06611 9.0121 5.80781 9.0121Z" fill="white" />
                  <path d="M11.1828 9.0121C11.9245 9.0121 12.5258 8.41083 12.5258 7.66913C12.5258 6.92744 11.9245 6.32617 11.1828 6.32617C10.4411 6.32617 9.83984 6.92744 9.83984 7.66913C9.83984 8.41083 10.4411 9.0121 11.1828 9.0121Z" fill="white" />
                  <path d="M16.4442 13.9428L15.0207 13.2092L15.5343 9.87025C15.5437 9.81031 15.5342 9.74895 15.5073 9.6946C15.4804 9.64024 15.4373 9.59556 15.3839 9.56668C15.3306 9.5378 15.2696 9.52614 15.2094 9.53331C15.1491 9.54047 15.0926 9.5661 15.0475 9.60669L11.5021 12.7962C11.4666 12.8286 11.4395 12.8692 11.4234 12.9145C11.4072 12.9597 11.4024 13.0083 11.4093 13.0558C11.4163 13.1034 11.4348 13.1485 11.4633 13.1873C11.4918 13.226 11.5293 13.2572 11.5726 13.278L13.0012 13.9579L12.4976 17.2515C12.4886 17.311 12.4981 17.3717 12.5248 17.4256C12.5515 17.4795 12.5941 17.5239 12.6468 17.5528C12.6995 17.5817 12.7598 17.5937 12.8196 17.5873C12.8793 17.5809 12.9357 17.5562 12.981 17.5167L16.5063 14.4162C16.5404 14.3843 16.5663 14.3447 16.5821 14.3008C16.5978 14.2568 16.6028 14.2098 16.5968 14.1635C16.5907 14.1173 16.5737 14.0731 16.5472 14.0347C16.5206 13.9963 16.4853 13.9648 16.4442 13.9428Z" fill="white" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div
            className={styles.chatListContainer}
            style={{ height: chatListAutoHeight }}
            ref={tabContentRef}
          >
            <ChatList
              chats={filteredChatList.length ? filteredChatList : chatUserList}
              chatOpsList={chatOpsList}
              onTabClick={handleTabClick}
              getSelectedUserData={(id: string) => getSelectedUserData(id)}
              newChatList={newChat}
            />
          </div>
        </div>

        {/* Chat Panel */}
        <div className={styles.chatPanel}>
          {isEmptyContentVisible ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyContent}>
                <MessageSquare size={32} />
                <p className={styles.emptyTextDesktop}>
                  Pick a person from the left menu, and start your conversation.
                </p>
                <p className={styles.emptyTextMobile}>
                  Select a person from the menu by clicking the button and start your conversation.
                </p>
                <button
                  type="button"
                  className={styles.startConversationBtn}
                  onClick={handleButtonClick}
                >
                  Start a conversation
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.activeChat}>
              {/* Chat header */}
              <div className={styles.chatHeader}>
                <button
                  type="button"
                  className={styles.sidebarToggle}
                  onClick={handleButtonClick}
                >
                  <Grid3X3 size={21} />
                </button>

                <div className={styles.metaInfo}>
                  <h5>{chatActiveUser?.receiver_name}</h5>
                  {!lastActive?.is_active ? (
                    <span>Last Seen {calculateTimeAgo(lastActive?.last_active)}</span>
                  ) : (
                    <span>online</span>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.infoToggle}
                  onClick={infoSidebarToggle}
                >
                  <Info size={19} />
                </button>
              </div>

              {/* Messages area */}
              <div className={styles.messengerDialog}>
                <div className={styles.messengerDialogArea}>
                  <div className={styles.messageContent}>
                    <ChatContent isEmptyContentVisible={isEmptyContentVisible} />
                  </div>

                  <div className={styles.chatAreaBottom}>
                    {attachmentFiles.length > 0 && (
                      <ChatAttachmentContent
                        attachments={attachmentFiles}
                        removeAttachment={(index: number) => removeAttachmentFile(index)}
                      />
                    )}
                    {attachmentDocFiles.length > 0 && (
                      <ChatAttachmentDocContent
                        attachmentsDoc={attachmentDocFiles}
                        removeAttachmentDoc={(index: number) => removeAttachmentDocFile(index)}
                      />
                    )}
                    <MessageInput
                      onAttachment={(values: any) => getAttachment(values)}
                      closeAttachments={() => {
                        setAttachmentFiles([]);
                        setAttachmentDocFiles([]);
                      }}
                    />
                  </div>
                </div>

                {/* User info sidebar */}
                <div className={`${styles.userInfoSidebar} ${isInfoSidebarActive ? styles.active : ""}`}>
                  {activeUser?.user_id && (
                    <UserInfoSidebar data={userById} roomId={activeUser?.room_id} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overlay */}
        <div
          className={`${styles.chatOverlay} ${isSidebarActive || isInfoSidebarActive ? styles.active : ""}`}
          onClick={handleOverlayClick}
        />
      </div>
    </div>
  );
}
