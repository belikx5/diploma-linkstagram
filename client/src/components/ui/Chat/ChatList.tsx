import React from "react";
import styles from "./chat.module.scss";
import ChatItem from "./ChatItem";
import { ChatBrief } from "../../../store/actionTypes/chatActionsTypes";
import { useTranslation } from "react-i18next";
import { Profile } from "../../../store/actionTypes/userActionTypes";

type Props = {
  chats: ChatBrief[];
  selectedChat: ChatBrief | null;
  user: Profile | null;
  onChatSelect: (chat: ChatBrief) => void;
};

const ChatList = ({ chats, selectedChat, user, onChatSelect }: Props) => {
  const [t] = useTranslation("common");

  if (!user) return null;
  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          lastMessage={chat.last_message}
          isSelected={selectedChat?.id === chat.id}
          onItemClick={() => onChatSelect(chat)}
          user={chat.companion}
        />
      ))}
      {!chats.length && (
        <h3 className={styles.chatListEmpty}>
          {t("chat.noChats")}
          <br /> {t("chat.findPeople")}
        </h3>
      )}
    </div>
  );
};

export default ChatList;
