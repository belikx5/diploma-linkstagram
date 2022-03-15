import React from 'react';
import styles from './chats.module.scss';
import { ChatList } from '../ui/Chat';

const Chats = () => {
	return (
		<div className={styles.container}>
			<ChatList />
		</div>
	);
};

export default Chats;
