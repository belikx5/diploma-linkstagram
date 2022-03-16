import React from 'react';
import styles from './chats.module.scss';
import { ChatList } from '../ui/Chat';
import Chat from './Chat';

const Chats = () => {
	return (
		<div className={styles.chatsContainer}>
			<aside className={styles.chatsList}>
				<ChatList />
			</aside>
			<Chat />
		</div>
	);
};

export default Chats;
