import React from 'react';
import styles from './chat.module.scss';
import clx from 'classnames';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../../User/UserIcon/UserIcon';

type ChatProps = {
	user: ProfileBrief;
	isSelected?: boolean;
	onItemClick: () => void;
};
const ChatItem = ({ user, isSelected = false, onItemClick }: ChatProps) => {
	return (
		<div
			onClick={onItemClick}
			className={clx(styles.chatItem, isSelected && styles.selected)}>
			<UserIcon icon={user.profile_photo} size={UserIconSize.Medium} />
			<div className={styles.data}>
				<p className={styles.username}>{user.username}</p>
				<p className={styles.lastMessage}>Some last message....</p>
			</div>
		</div>
	);
};

export default ChatItem;
