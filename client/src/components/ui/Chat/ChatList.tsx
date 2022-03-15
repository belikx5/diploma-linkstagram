import React from 'react';
import styles from './chat.module.scss';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import ChatItem from './ChatItem';

const chats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ChatList = () => {
	const user = useTypedSelector(state => state.userState.currentUser);
	if (!user) return null;
	return (
		<div className={styles.chatList}>
			{chats.map(el => (
				<ChatItem key={el} user={user} />
			))}
		</div>
	);
};

export default ChatList;
