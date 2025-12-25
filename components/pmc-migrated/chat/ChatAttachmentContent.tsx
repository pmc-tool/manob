"use client";

import { X } from "lucide-react";
import styles from "./chat.module.css";

interface ChatAttachmentContentProps {
  attachments: any[];
  removeAttachment: (index: number) => void;
}

export default function ChatAttachmentContent({
  attachments,
  removeAttachment,
}: ChatAttachmentContentProps) {
  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className={styles.attachmentPreviewArea}>
      {attachments.map((attachment, index) => (
        <div key={index} className={styles.attachmentPreviewItem}>
          {attachment.type === "image" && attachment.message && (
            <img
              src={getPreviewUrl(attachment.message)}
              alt={`Attachment ${index + 1}`}
              className={styles.attachmentPreviewImage}
            />
          )}
          <button
            type="button"
            className={styles.removeAttachmentBtn}
            onClick={() => removeAttachment(index)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
