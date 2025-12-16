"use client";

import { CheckCheck, Download } from "lucide-react";
import styles from "./chat.module.css";

interface ChatDocProps {
  documentName: string;
  documentSize: string;
  documentLink: string;
  sendingTime: string;
  isSelf?: boolean;
  isSeen?: string;
}

export default function ChatDoc({
  documentName,
  documentSize,
  documentLink,
  sendingTime,
  isSelf,
  isSeen,
}: ChatDocProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  const onDownloadClick = () => {
    const anchor = document.createElement("a");
    anchor.href = `${process.env.NEXT_PUBLIC_S3BUCKET}/${documentLink}`;
    anchor.download = documentName || "downloaded-file";
    anchor.target = "_blank";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div
      className={`flex items-center gap-1 flex-wrap ${
        isSelf ? "flex-row-reverse" : ""
      }`}
    >
      <div className={`${styles.text} ${isSelf ? styles.textMe : ""}`}>
        <div className={styles.attachment}>
          <button
            className={styles.downloadBtn}
            onClick={onDownloadClick}
            type="button"
          >
            <Download size={18} />
          </button>
          <div className={styles.fileInfo}>
            <h5>
              <a
                href={`${process.env.NEXT_PUBLIC_S3BUCKET}/${documentLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {documentName}
              </a>
            </h5>
            <span>{documentSize}</span>
          </div>
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
