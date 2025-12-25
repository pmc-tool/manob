"use client";

import ChatImage from "./ChatImage";
import ChatDoc from "./ChatDoc";

interface CommonAttachmentProps {
  chatAttachments: any[];
  sendingTime: string;
  isSelf: boolean;
  isSeen: string;
}

export default function CommonAttachment({
  chatAttachments,
  sendingTime,
  isSelf,
  isSeen,
}: CommonAttachmentProps) {
  const { imageAttachments, docAttachments } = chatAttachments.reduce(
    (acc: { imageAttachments: any[]; docAttachments: any[] }, attachment) => {
      if (attachment.mimetype?.includes("image")) {
        acc.imageAttachments.push(attachment);
      } else {
        acc.docAttachments.push(attachment);
      }
      return acc;
    },
    { imageAttachments: [], docAttachments: [] }
  );

  const formatFileSize = (size: number | string) => {
    const sizeNum = typeof size === "string" ? parseFloat(size) : size;
    if (sizeNum < 1024) {
      return `${sizeNum.toFixed(2)} KB`;
    }
    return `${(sizeNum / 1024).toFixed(2)} MB`;
  };

  return (
    <>
      {imageAttachments && imageAttachments.length > 0 && (
        <ChatImage
          galleryID="chat-gallery"
          images={imageAttachments}
          sendingTime={sendingTime}
          isSelf={isSelf}
          isSeen={isSeen}
        />
      )}
      {docAttachments &&
        docAttachments.length > 0 &&
        docAttachments.map((doc: any, index: number) => (
          <ChatDoc
            key={index}
            documentName={doc.filename}
            documentSize={formatFileSize(doc.size)}
            documentLink={doc.url}
            sendingTime={sendingTime}
            isSelf={isSelf}
            isSeen={isSeen}
          />
        ))}
    </>
  );
}
