import './userBriefList.scss';
import React from 'react';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../UserIcon/UserIcon';

type UserBriefListProps = {
	users: ProfileBrief[];
};

const UserBriefList = ({ users }: UserBriefListProps) => {
	return (
		<div className='user-brief-list'>
			{users.map(user => (
				<div key={user.id} className='user-card'>
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
