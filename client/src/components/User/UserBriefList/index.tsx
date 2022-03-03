import './userBriefList.scss';
import React from 'react';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../UserIcon/UserIcon';
import history from '../../../services/history';

type UserBriefListProps = {
	users: ProfileBrief[];
	toggleModal?: (val: boolean) => void;
};

const UserBriefList = ({ users, toggleModal }: UserBriefListProps) => {
	const handleUserClick = (uid: number) => {
		history.push(`/profile/${uid}`);
		toggleModal && toggleModal(false);
	};

	return (
		<div className='user-brief-list'>
			{users.map(user => (
				<div
					key={user.id}
					onClick={() => handleUserClick(user.id)}
					className='user-card'>
					<UserIcon icon={user.profile_photo} size={UserIconSize.Small} />
					<span>{user.username}</span>
					{(user.first_name || user.last_name) && (
						<span>
							- {user.first_name} {user.last_name}
						</span>
					)}
				</div>
			))}
			{!users.length && <p>Users not found...</p>}
		</div>
	);
};

export default UserBriefList;
