import React, { useCallback, useEffect, useRef, useState } from "react";
import { elementScrollIntoView } from "seamless-scroll-polyfill";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import history from "../../services/history";
import {
  fetchChatMessages,
  resetChatMessages,
  resetChatWebSocket,
  selectChat,
  sendMessage,
  setChatWebSocket,
} from "../../store/actions/chatActions";
import { ChatBrief } from "../../store/actionTypes/chatActionsTypes";
import Message from "../ui/Chat/Message";
import MessageInput from "../ui/Chat/MessageInput";
import styles from "./chats.module.scss";

type Props = {
  selectedChat: ChatBrief | null;
};

const Chat = ({ selectedChat }: Props) => {
  const dispatch = useTypedDispatch();
  const endMsgRef = useRef<HTMLDivElement | null>(null);
  const messages = useTypedSelector((state) => state.chatState.messages);
  const fetchMessageJob = useTypedSelector(
    (state) => state.chatState.fetchMessageJob
  );
  const currentUser = useTypedSelector((state) => state.userState.currentUser);

  const handleNavigateToUserprofile = useCallback(() => {
    history.push("/profile/" + selectedChat?.companion.id);
  }, [selectedChat]);

  const handleSendMsg = useCallback(
    (msg: string) => {
      if (!selectedChat) return;
      dispatch(sendMessage(selectedChat.id, msg));
    },
    [dispatch, selectedChat]
  );

  useEffect(() => {
    if (selectedChat && selectedChat.id && !fetchMessageJob) {
      dispatch(setChatWebSocket(selectedChat.id));
      dispatch(fetchChatMessages(selectedChat.id));
    }
  }, [selectedChat, fetchMessageJob]);

  useEffect(() => {
    if (endMsgRef && endMsgRef.current)
      elementScrollIntoView(endMsgRef.current, {
        block: "nearest",
        behavior: "smooth",
      });
  }, [messages.length, endMsgRef]);

  useEffect(() => {
    return () => {
      dispatch(selectChat(null));
      dispatch(resetChatMessages());
      dispatch(resetChatWebSocket());
    };
  }, []);

  if (!selectedChat) return null;

  return (
    <section className={styles.chat}>
      <header>
        <img src='/assets/arrow-left.svg' alt='return' />
        {!selectedChat.companion ? (
          <h4 className={styles.noUser}>Choose follower to start chatting</h4>
        ) : (
          <h4 onClick={handleNavigateToUserprofile} className={styles.username}>
            {selectedChat.companion.username}{" "}
            {(selectedChat.companion.first_name ||
              selectedChat.companion.last_name) && (
              <>
                - {selectedChat.companion.first_name}{" "}
                {selectedChat.companion.last_name}
              </>
            )}
          </h4>
        )}
      </header>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <Message
            key={msg.id}
            isMyMessage={msg.sender.id === currentUser?.id}
            text={msg.content}
          />
        ))}
        <div ref={endMsgRef} />
      </div>
      <div className={styles.messageInput}>
        <MessageInput onMessageSend={handleSendMsg} />
      </div>
    </section>
  );
};

export default Chat;
