// MIGRATION: MessageInput component from manob.ai
'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Smile, Paperclip, Send, X } from 'lucide-react';
import styles from './chat.module.css';

interface AttachmentPreview {
  file: File;
  type: 'image' | 'doc';
  preview?: string;
}

interface MessageInputProps {
  onSendMessage: (message: string, attachments: File[]) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (disabled || isLoading) return;
    if (!message.trim() && attachments.length === 0) return;

    setIsLoading(true);
    const files = attachments.map((a) => a.file);
    await onSendMessage(message.trim(), files);
    setMessage('');
    setAttachments([]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.includes('image');
      const preview = isImage ? URL.createObjectURL(file) : undefined;
      setAttachments((prev) => [
        ...prev,
        { file, type: isImage ? 'image' : 'doc', preview },
      ]);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.preview) URL.revokeObjectURL(a.preview);
      });
    };
  }, []);

  const commonEmojis = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🎉', '😊', '🤔', '👏', '💪', '✨'];

  return (
    <div className={styles.chatAreaBottom}>
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className={styles.attachmentPreviewList}>
          {attachments.map((att, index) => (
            <div key={index} className={styles.attachmentPreview}>
              {att.type === 'image' ? (
                <img src={att.preview} alt={att.file.name} />
              ) : (
                <div className={styles.docPreview}>
                  <span>{att.file.name}</span>
                </div>
              )}
              <button className={styles.removeAttachment} onClick={() => removeAttachment(index)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputWrapper}>
        {/* Emoji button */}
        <div className={styles.emojiWrapper}>
          <button
            type="button"
            className={`${styles.emojiBtn} ${isEmojiOpen ? styles.active : ''}`}
            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
          >
            {isEmojiOpen ? <X size={20} /> : <Smile size={20} />}
          </button>

          {/* Simple emoji picker */}
          {isEmojiOpen && (
            <div className={styles.emojiPicker}>
              {commonEmojis.map((emoji, i) => (
                <button
                  key={i}
                  className={styles.emojiItem}
                  onClick={() => {
                    setMessage((prev) => prev + emoji);
                    textAreaRef.current?.focus();
                  }}
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type something..."
          className={styles.chatTextarea}
          maxLength={2500}
          rows={1}
          disabled={disabled}
        />

        {/* Attachment button */}
        <div className={styles.attachmentWrapper}>
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.zip,.rar"
          />
        </div>
      </div>

      {/* Send button */}
      <button
        type="button"
        className={styles.sendBtn}
        onClick={handleSubmit}
        disabled={disabled || isLoading || (!message.trim() && attachments.length === 0)}
      >
        <Send size={20} />
      </button>
    </div>
  );
}
