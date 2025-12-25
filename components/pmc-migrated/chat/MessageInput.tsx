"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Smile, Paperclip, Send, X, PlusCircle, Percent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/SocketProvider";
import { useAppSelector, useAppStore } from "@/state/hooks";
import { useUploadAttachmentFilesMutation } from "@/state/services/chat-service/chat-user-service";
import {
  changeTypeState,
  resetDocAttachment,
  resetImageAttachment,
  SetDocAttachment,
  SetImageAttachment,
} from "@/state/slices/chat.slice";
import OfferCreate from "./OfferCreate";
import styles from "./chat.module.css";

// Emoji picker data
const commonEmojis = [
  "😀", "😂", "😍", "🔥", "👍", "❤️", "🎉", "😊",
  "🤔", "👏", "💪", "✨", "😎", "🙌", "💯", "🚀",
];

interface MessageInputProps {
  onAttachment: (files: FileList) => void;
  closeAttachments: () => void;
}

export default function MessageInput({
  onAttachment,
  closeAttachments,
}: MessageInputProps) {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerModal, setOfferModal] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userMood, setUserMood] = useState<string | null>(null);

  // Get userMood on client side only to avoid hydration mismatch
  useEffect(() => {
    setUserMood(localStorage.getItem("r_ty"));
  }, []);

  const attachmentFiles = useSelector(
    (state: any) => state.chatStore.image_attachment
  );
  const attachmentDocFiles = useSelector(
    (state: any) => state.chatStore.doc_attachment
  );

  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const appStore = useAppStore();

  const [uploadFiles] = useUploadAttachmentFilesMutation();

  const chatActiveUser = useAppSelector((state) => state.chatStore.active_user);
  const authUser: any = useAppSelector((state) => state.auth.userInfo);

  const PIXI_ID = process.env.NEXT_PUBLIC_PIXI_ID || "bc6c40c2-625b-49b2-b46a-39b7b0e54634";

  const togglePicker = () => {
    setIsEmojiOpen(!isEmojiOpen);
  };

  const addEmoji = (emoji: string) => {
    if (textAreaRef.current) {
      const cursorPosition = textAreaRef.current.selectionStart;
      const textBeforeCursor = textAreaValue.substring(0, cursorPosition);
      const textAfterCursor = textAreaValue.substring(cursorPosition);
      setTextAreaValue(textBeforeCursor + emoji + textAfterCursor);

      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionEnd = cursorPosition + emoji.length;
          textAreaRef.current.focus();
        }
      }, 0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setIsDropdownOpen(false);
  };

  const handleAttachmentAdd = (files: FileList) => {
    onAttachment(files);
    if (files[0].type.includes("image")) {
      dispatch(SetImageAttachment(files[0]));
    } else {
      dispatch(SetDocAttachment(files[0]));
    }
  };

  const sendMessage = async () => {
    setIsLoading(true);
    if (
      attachmentFiles &&
      attachmentFiles.length === 0 &&
      attachmentDocFiles &&
      attachmentDocFiles.length === 0 &&
      (!textAreaValue || textAreaValue.trim() === "")
    ) {
      setIsLoading(false);
      return;
    }

    let attachmentUploadedFiles: any = [];

    if (attachmentFiles.length > 0 || attachmentDocFiles.length > 0) {
      const attach = [...attachmentFiles, ...attachmentDocFiles];
      const formData = new FormData();
      attach.forEach((file: File) => {
        formData.append("files", file);
      });
      formData.append("room_id", chatActiveUser?.room_id || "");
      formData.append("sender_id", authUser?.id);
      formData.append("receiver_id", chatActiveUser?.receiver_id);

      try {
        const response: any = await uploadFiles(formData);
        if (response.data?.status === true) {
          attachmentUploadedFiles = response?.data?.data?.medias;
        }
      } catch (error: any) {
        setIsLoading(false);
        return;
      }
    }

    if (
      textAreaValue.trim() !== "" ||
      (attachmentUploadedFiles && attachmentUploadedFiles.length > 0)
    ) {
      const obj: any = {
        receiver_id: chatActiveUser?.receiver_id,
        sender_id: authUser?.id,
        message: textAreaValue,
        message_type:
          chatActiveUser?.receiver_id === PIXI_ID ? "AGENT" : "GENERAL",
        message_data: {
          text: textAreaValue,
        },
      };

      if (attachmentUploadedFiles.length > 0) {
        obj.attachments = attachmentUploadedFiles;
      }

      socket?.emit("sendMessage", obj);

      if (obj.message_type === "AGENT") {
        dispatch(
          changeTypeState({ room_id: chatActiveUser?.room_id, typing: true })
        );
      }

      dispatch(resetDocAttachment());
      dispatch(resetImageAttachment());
      closeAttachments();
      setTextAreaValue("");
      attachmentUploadedFiles = [];
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  if (!chatActiveUser) {
    return null;
  }

  function handleSave() {
    if (typeof document !== "undefined") {
      const form = document.getElementById(
        "customOfferForm"
      ) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  }

  function textMessageHandler(e: ChangeEvent<HTMLTextAreaElement>): void {
    setTextAreaValue(e.target.value);
    setTimeout(() => {
      socket?.emit("typing", {
        room_id: chatActiveUser?.room_id,
        receiver_id: chatActiveUser?.receiver_id,
      });
    }, 500);
  }

  return (
    <>
      <div className={styles.messageInputArea}>
        <div className={styles.inputWrapper}>
          {/* Emoji button */}
          <div className={styles.emojiWrapper}>
            <button
              type="button"
              ref={buttonRef}
              className={`${styles.emojiBtn} ${isEmojiOpen ? styles.active : ""}`}
              onClick={togglePicker}
            >
              {isEmojiOpen ? <X size={21} /> : <Smile size={21} />}
            </button>
            {isEmojiOpen && (
              <div className={styles.emojiPicker} ref={pickerRef}>
                {commonEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    className={styles.emojiItem}
                    onClick={() => addEmoji(emoji)}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text input */}
          <textarea
            ref={textAreaRef}
            value={textAreaValue}
            maxLength={2500}
            onChange={(e) => textMessageHandler(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className={styles.chatTextarea}
            rows={1}
            placeholder="Type something..."
          />

          {/* More options (attachment, custom offer) */}
          {chatActiveUser?.receiver_id !== PIXI_ID && (
            <div className={styles.moreOptionsWrapper} ref={dropdownRef}>
              <button
                type="button"
                className={styles.moreOptionsBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <PlusCircle size={21} />
              </button>
              {isDropdownOpen && (
                <div className={styles.moreOptionsDropdown}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={handleAttachmentClick}
                  >
                    <Paperclip size={20} className="text-blue-500" />
                    <span>Attachment</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e: any) => handleAttachmentAdd(e.target.files)}
                    accept="image/*,.pdf,.doc,.docx,.zip,.rar"
                  />
                  {userMood === "SELLER" && (
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setOfferModal(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Percent size={18} className="text-green-500" />
                      <span>Custom Offer</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="button"
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={isLoading}
        >
          <Send size={21} />
        </button>
      </div>

      {/* Custom Offer Modal */}
      {offerModal && (
        <OfferCreate
          showModal={() => setOfferModal(true)}
          handleCloseModal={() => setOfferModal(false)}
          handleSave={handleSave}
        />
      )}
    </>
  );
}
