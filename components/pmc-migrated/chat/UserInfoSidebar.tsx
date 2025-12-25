"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Download, Link as LinkIcon, FileText } from "lucide-react";
import Link from "next/link";
import { useGetMediaChatListQuery } from "@/state/services/chat-service/chat-user-service";
import { addActiveUSerStatus } from "@/state/slices/chat.slice";
import store from "@/state/store";
import Avatar from "../shared/avatar/Avatar";
import styles from "./chat.module.css";

interface UserData {
  id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  location?: string;
  member_since?: string;
  avg_rating?: number;
}

interface Props {
  data: UserData;
  roomId: any;
  currentUserId?: string;
}

// File icon helper
const getFileIcon = (filename: string) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const iconClasses: Record<string, string> = {
    pdf: "text-red-500",
    doc: "text-blue-500",
    docx: "text-blue-500",
    txt: "text-gray-500",
    xls: "text-green-500",
    xlsx: "text-green-500",
    zip: "text-yellow-500",
    rar: "text-yellow-500",
  };
  return iconClasses[ext || ""] || "text-gray-500";
};

export default function UserInfoSidebar({
  data,
  roomId,
  currentUserId,
}: Props) {
  const { data: mediaData, refetch } = useGetMediaChatListQuery(roomId, {
    skip: !roomId,
  });

  const isCurrentUser = data?.id === currentUserId;

  const availableTabs = useMemo(() => {
    const baseTabs = [{ key: "mediaTab", label: "Media" }];
    if (!isCurrentUser) {
      baseTabs.push({ key: "links", label: "Links" });
      baseTabs.push({ key: "docs", label: "Docs" });
    }
    return baseTabs;
  }, [isCurrentUser]);

  const [tab, setTab] = useState(availableTabs[0].key);

  useEffect(() => {
    setTab(availableTabs[0].key);
  }, [data?.id, availableTabs]);

  useEffect(() => {
    store.dispatch(addActiveUSerStatus(mediaData?.data?.usoc_status));
  }, [mediaData]);

  const changeTab = (val: string) => {
    setTab(val);
    refetch();
  };

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return "";
    if (avatar.includes("https://") || avatar.includes("http://")) {
      return avatar;
    }
    return `${process.env.NEXT_PUBLIC_S3BUCKET}/${avatar}`;
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("https://") || url.includes("http://")) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_S3BUCKET}/${url}`;
  };

  return (
    <>
      {/* User Info Card */}
      <div className={styles.userInfoCard}>
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Avatar
                avatar={getAvatarUrl(data?.profile_image)}
                username={data?.user_name}
                size={70}
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  mediaData?.data?.usoc_status?.is_active
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
            </div>
          </div>
          <div className={styles.infoText}>
            <h5 className="text-lg font-medium mb-1">
              {data?.first_name} {data?.last_name}
            </h5>
            <Link
              href={`/${data?.user_name}`}
              className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={14} className="flex-shrink-0" />
            {!mediaData?.data?.usoc_status?.is_active ? (
              <span>
                Last Seen{" "}
                {new Date(
                  mediaData?.data?.usoc_status?.last_active
                ).toLocaleTimeString()}
              </span>
            ) : (
              <span className="text-green-600">Online</span>
            )}
          </div>
          {data?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} className="flex-shrink-0" />
              <span>{data.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.profileTabsWrap}>
        <div className={styles.profileTabs}>
          {availableTabs.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.profileTabBtn} ${
                tab === key ? styles.active : ""
              }`}
              onClick={() => changeTab(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {/* Media Tab */}
          {tab === "mediaTab" && (
            <div className={styles.mediaGrid}>
              {mediaData?.data?.medias?.length === 0 ? (
                <p className="text-center text-gray-500 col-span-3 py-4">
                  No photos found
                </p>
              ) : (
                mediaData?.data?.medias?.map((image: any, index: number) => (
                  <a
                    key={index}
                    href={getImageUrl(image.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mediaItem}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))
              )}
            </div>
          )}

          {/* Links Tab */}
          {tab === "links" && !isCurrentUser && (
            <div className="space-y-2">
              {mediaData?.data?.links?.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No links found</p>
              ) : (
                mediaData?.data?.links?.map((link: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <LinkIcon size={18} className="text-blue-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">
                          {link.message}
                        </h5>
                        <span className="text-xs text-gray-500">
                          {new Date(link.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <a
                      href={link.message}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {link.message}
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Docs Tab */}
          {tab === "docs" && !isCurrentUser && (
            <div className="space-y-2">
              {!mediaData?.data?.documents ||
              mediaData?.data?.documents?.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No documents found
                </p>
              ) : (
                mediaData?.data?.documents?.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <FileText
                      size={24}
                      className={getFileIcon(doc.media?.filename)}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate">
                        {doc.media?.filename}
                      </h5>
                      <span className="text-xs text-gray-500">
                        {new Date(doc.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <a
                      href={getImageUrl(doc.media?.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
