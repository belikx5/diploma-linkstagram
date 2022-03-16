import React from 'react';
import { ProfileBrief } from '../../store/actionTypes/userActionTypes';
import styles from './chats.module.scss';

// type Props = {
// 	user: ProfileBrief;
// };

const Chat = () => {
	const user = {
		username: 'test',
		first_name: 'Ihorko',
		last_name: 'Belik',
	};
	return (
		<section className={styles.chat}>
			<header>
				<img src='/assets/arrow-left.svg' alt='return' />
				{!user ? (
					<h4 className={styles.noUser}>Choose follower to start chatting</h4>
				) : (
					<h4 className={styles.username}>
						{user.username}{' '}
						{(user.first_name || user.last_name) && (
							<>
								- {user.first_name} {user.last_name}
							</>
						)}
					</h4>
				)}
			</header>
			<div className={styles.messagesContainer}></div>
			<div className={styles.messageInput}></div>
		</section>
	);
};

export default Chat;
