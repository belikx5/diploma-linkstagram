import React, { useCallback, useEffect } from 'react';
import styles from './chats.module.scss';
import { ChatList } from '../ui/Chat';
import Chat from './Chat';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { ChatBrief } from '../../store/actionTypes/chatActionsTypes';
import { fetchChats, selectChat } from '../../store/actions/chatActions';

const Chats = () => {
	const dispatch = useTypedDispatch();
	const user = useTypedSelector(state => state.userState.currentUser);
	const chats = useTypedSelector(state => state.chatState.chats);
	const selectedChat = useTypedSelector(state => state.chatState.selectedChat);

	const handleChatSelect = useCallback(
		(chat: ChatBrief) => {
			dispatch(selectChat(chat));
		},
		[dispatch]
	);
	useEffect(() => {
		dispatch(fetchChats());
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
