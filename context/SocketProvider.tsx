"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PmcSocket from "../lib/socket";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppStore } from "../state/hooks";
import {
  addNewRecentChat,
  AppendMeesageHistory,
  AppendRecievedMessage,
  changeTypeState,
  PreviewsMessageHistory,
  resetNewChat,
  setChatConnect,
  setChatList,
  setChatOps,
  // setChatConnect,
} from "../state/slices/chat.slice";
import PmcJobSocket from "../lib/jobSocket";
import {
  SetAllLiveJobs,
  SetLiveJobBids,
  SetLiveJobModalDeclined,
  SetNewLiveJob,
} from "../state/slices/liveJob.slice";
import { useSelector } from "react-redux";
import store from "../state/store";

const SocketContext = createContext<typeof PmcSocket>(PmcSocket);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // const notificationAudio = useRef<any>(null);
  const appStore = useAppStore();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("p_aut") : "";

  // useEffect(() => {
  //   notificationAudio.current = new Audio(
  //     "/sounds/ui-bell-ding-om-fx-2-2-00-04.mp3"
  //   );
  // }, []);

  const handleChange = (data: any) => {
    appStore.dispatch(changeTypeState(data));

    setTimeout(() => {
      appStore.dispatch(changeTypeState({ ...data, typing: false }));
    }, 3000);
  };
  useEffect(() => {
    if (PmcSocket) {
      PmcSocket?.on("newMessage", (data) => {
        PmcSocket?.emit("chatHistory", {});
        console.log("newMessage", data);
        // appStore.dispatch(addNewRecentChat(data.message));
        // notificationAudio.current?.play();
        appStore.dispatch(AppendRecievedMessage(data.message));
      });
      PmcSocket?.on("messageDelivered", (data) => {
        appStore.dispatch(AppendMeesageHistory(data.message));
        appStore.dispatch(resetNewChat());
        PmcSocket?.emit("chatHistory", {});
      });

      PmcSocket?.on("chatHistory", (data: any) => {
        let chatUsersData: any = {};
        chatUsersData = data.chat_hostory.reduce(
          (acc: any, user: any) => {
            if (
              user.receiver_id == "bc6c40c2-625b-49b2-b46a-39b7b0e54634" &&
              user.sended_by !== "bc6c40c2-625b-49b2-b46a-39b7b0e54634"
            ) {
              acc["chat_list"][user.receiver_id] = { ...user, is_typing: true };
            } else {
              acc["chat_list"][user.receiver_id] = {
                ...user,
                is_typing: false,
              };
            }
            acc["chat_ops"][user.room_id] = { is_typing: true };
            return acc;
          },
          {
            chat_list: {},
            chat_ops: {},
          }
        );

        appStore.dispatch(setChatOps(chatUsersData.chat_ops));

        const reversedChatUsers = Object.fromEntries(
          Object.entries(chatUsersData.chat_list)
        );
        appStore.dispatch(setChatList(reversedChatUsers));
      });

      PmcSocket.on("typing", (data) => {
        handleChange(data);
      });
    }
  }, []);

  // useEffect(() => {
  //   if (PmcJobSocket) {
  //     PmcJobSocket.on("liveJobsList", (data) => {
  //       console.log("job list", data);
  //       appStore.dispatch(SetAllLiveJobs(data));
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (PmcJobSocket) {
      PmcJobSocket.on("newLiveJob", (data) => {
        // console.log("liveJobsList", data);
        appStore.dispatch(SetNewLiveJob(data));
        store.dispatch(SetLiveJobModalDeclined(false));
      });
    }
  }, []);

  useEffect(() => {
    if (PmcJobSocket) {
      PmcJobSocket.on("bidsList", (bidData) => {
        // console.log("bidsList socket", bidData);
        appStore.dispatch(SetLiveJobBids(bidData));
      });
    }
  }, []);

  return (
    <SocketContext.Provider value={PmcSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket: any = () => {
  return useContext(SocketContext);
};
