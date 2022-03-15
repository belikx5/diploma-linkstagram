import React from 'react';
import styles from './chat.module.scss';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../../User/UserIcon/UserIcon';

type ChatProps = {
	user: ProfileBrief;
};
const ChatItem = ({ user }: ChatProps) => {
	return (
		<div className={styles.chatItem}>
			<UserIcon icon={user.profile_photo} size={UserIconSize.Medium} />
			<div className={styles.data}>
				<p className={styles.username}>{user.username}</p>
				<p className={styles.lastMessage}>Some last message....</p>
			</div>
		</div>
	);
};

export default ChatItem;
