"use client";

import { FileText, X } from "lucide-react";
import styles from "./chat.module.css";

interface ChatAttachmentDocContentProps {
  attachmentsDoc: any[];
  removeAttachmentDoc: (index: number) => void;
}

export default function ChatAttachmentDocContent({
  attachmentsDoc,
  removeAttachmentDoc,
}: ChatAttachmentDocContentProps) {
  return (
    <div className={styles.attachmentPreviewArea}>
      {attachmentsDoc.map((attachment, index) => (
        <div key={index} className={styles.attachmentDocPreviewItem}>
          <FileText size={24} className="text-blue-500" />
          <span className={styles.docFileName}>
            {attachment.documents?.name || "Document"}
          </span>
          <button
            type="button"
            className={styles.removeAttachmentBtn}
            onClick={() => removeAttachmentDoc(index)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
