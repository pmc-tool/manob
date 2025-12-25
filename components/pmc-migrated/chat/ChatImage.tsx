"use client";

import { CheckCheck } from "lucide-react";
import Image from "next/image";
import styles from "./chat.module.css";

interface ChatImageProps {
  galleryID: string;
  images: any[];
  sendingTime: string;
  isSelf?: boolean;
  isSeen?: string;
}

export default function ChatImage({
  galleryID,
  images,
  sendingTime,
  isSelf,
  isSeen,
}: ChatImageProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("https://") || url.includes("http://")) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_S3BUCKET}/${url}`;
  };

  return (
    <div
      className={`flex items-center gap-1 flex-wrap ${
        isSelf ? "flex-row-reverse" : ""
      }`}
    >
      <div className={`${styles.text} ${isSelf ? styles.textMe : ""}`}>
        <div className={styles.imageGallery}>
          {images.map((image, index) => (
            <a
              key={index}
              href={getImageUrl(image.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.galleryItem}
            >
              <img
                src={getImageUrl(image.url)}
                alt={image.filename || `Image ${index + 1}`}
                className={styles.chatImagePreview}
              />
            </a>
          ))}
        </div>
        <div
          className={`${styles.textSendingTime} ${
            isSeen === "READ" && isSelf ? styles.seen : ""
          }`}
        >
          {formatTime(sendingTime)}
          {isSelf && (
            <CheckCheck
              size={14}
              className={`${styles.checkIcon} ${
                isSeen === "READ" ? styles.seen : ""
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
