import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import {
	fetchChatMessages,
	resetChatMessages,
	selectChat,
} from '../../store/actions/chatActions';
import { ChatBrief } from '../../store/actionTypes/chatActionsTypes';
import Message from '../ui/Chat/Message';
import MessageInput from '../ui/Chat/MessageInput';
import styles from './chats.module.scss';

type Props = {
	selectedChat: ChatBrief | null;
};

const Chat = ({ selectedChat }: Props) => {
	const dispatch = useTypedDispatch();
	const messages = useTypedSelector(state => state.chatState.messages);
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const handleSendMsg = (msg: string) => {
		console.log(msg);
	};

	useEffect(() => {
		if (selectedChat) dispatch(fetchChatMessages(selectedChat.id));
	}, [selectedChat]);

	useEffect(() => {
		return () => {
			dispatch(selectChat(null));
			dispatch(resetChatMessages());
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
					<h4 className={styles.username}>
						{selectedChat.companion.username}{' '}
						{(selectedChat.companion.first_name ||
							selectedChat.companion.last_name) && (
							<>
								- {selectedChat.companion.first_name}{' '}
								{selectedChat.companion.last_name}
							</>
						)}
					</h4>
				)}
			</header>
			<div className={styles.messagesContainer}>
				{messages.map(msg => (
					<Message
						key={msg.id}
						isMyMessage={msg.sender.id === currentUser?.id}
						text={msg.content}
					/>
				))}
			</div>
			<div className={styles.messageInput}>
				<MessageInput onMessageSend={handleSendMsg} />
			</div>
		</section>
	);
};

export default Chat;
