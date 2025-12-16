"use client";

import { CheckCheck } from "lucide-react";
import styles from "./chat.module.css";

interface ChatTextProps {
  message: string;
  sendingTime: string;
  isSelf?: boolean;
  isSeen?: string;
}

export default function ChatText({
  message,
  sendingTime,
  isSelf,
  isSeen,
}: ChatTextProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Detect and format links in text
  const formatMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex items-center gap-1 flex-wrap ${
        isSelf ? "flex-row-reverse" : ""
      }`}
    >
      <div className={`${styles.text} ${isSelf ? styles.textMe : ""}`}>
        <p className="whitespace-pre-wrap break-words">{formatMessage(message)}</p>
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
