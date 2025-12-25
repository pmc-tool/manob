"use client";

import styles from "./chat.module.css";

interface ChatAgentTextProps {
  message: string;
  sendingTime: string;
  authUser: any;
}

export default function ChatAgentText({
  message,
  sendingTime,
  authUser,
}: ChatAgentTextProps) {
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
    <div className="flex items-center gap-1 flex-wrap">
      <div className={styles.text}>
        <p className="whitespace-pre-wrap break-words">{formatMessage(message)}</p>
        <div className={styles.textSendingTime}>{formatTime(sendingTime)}</div>
      </div>
    </div>
  );
}
