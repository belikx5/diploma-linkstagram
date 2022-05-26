import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./chat.module.scss";

type Props = {
  onMessageSend: (msg: string) => void;
};

const MessageInput = ({ onMessageSend }: Props) => {
  const [t] = useTranslation("common");
  const [message, setMessage] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onMessageSend(message);
      setMessage("");
    }
  };
  const handleSendClick = () => {
    if (!message.trim()) return;
    onMessageSend(message);
    setMessage("");
  };
  return (
    <div className={styles.messageInputContainer}>
      <textarea
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.sendButton} onClick={handleSendClick}>
        {t("common.send")}
      </button>
    </div>
  );
};

export default MessageInput;
