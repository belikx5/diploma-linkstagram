import React from 'react';
import styles from './userBrief.module.scss';
import history from '../../../services/history';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../UserIcon/UserIcon';

type Props = {
	user: ProfileBrief;
	onUserClick?: (id: number) => void;
	iconSize?: UserIconSize;
};

const UserBrief = ({ user, onUserClick, iconSize }: Props) => {
	const handleUserClick = (uid: number) => {
		history.push(`/profile/${uid}`);
		onUserClick && onUserClick(uid);
	};
	return (
		<div
			key={user.id}
			onClick={() => handleUserClick(user.id)}
			className={styles.userCard}>
			<UserIcon
				icon={user.profile_photo}
				size={iconSize ?? UserIconSize.Small}
			/>
			<span>{user.username}</span>
			{(user.first_name || user.last_name) && (
				<span>
					- {user.first_name} {user.last_name}
				</span>
			)}
		</div>
	);
};

export default UserBrief;
