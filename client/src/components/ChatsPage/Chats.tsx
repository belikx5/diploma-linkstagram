import React, { useCallback, useEffect } from "react";
import styles from "./chats.module.scss";
import { ChatList } from "../ui/Chat";
import Chat from "./Chat";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { ChatBrief } from "../../store/actionTypes/chatActionsTypes";
import {
  fetchChats,
  resetChatMessages,
  resetChatWebSocket,
  selectChat,
} from "../../store/actions/chatActions";
import { useLocation } from "react-router-dom";

const Chats = () => {
  const dispatch = useTypedDispatch();
  const { search } = useLocation();
  const user = useTypedSelector((state) => state.userState.currentUser);
  const chats = useTypedSelector((state) => state.chatState.chats);
  const selectedChat = useTypedSelector(
    (state) => state.chatState.selectedChat
  );

  const handleChatSelect = useCallback(
    (chat: ChatBrief) => {
      dispatch(selectChat(chat));
      dispatch(resetChatMessages());
      dispatch(resetChatWebSocket());
    },
    [dispatch]
  );
  useEffect(() => {
    const searchedUid = new URLSearchParams(search);
    const uid = searchedUid.get("u") ?? "";
    const parsedUID = !isNaN(+uid) ? +uid : undefined;
    dispatch(fetchChats(parsedUID));
  }, []);
  return (
    <div className={styles.chatsContainer}>
      <aside className={styles.chatsList}>
        <ChatList
          user={user}
          selectedChat={selectedChat}
          chats={chats}
          onChatSelect={handleChatSelect}
        />
      </aside>
      <Chat selectedChat={selectedChat} />
    </div>
  );
};

export default Chats;
