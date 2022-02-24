import React from 'react';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../UserIcon/UserIcon';

type UserBriefListProps = {
	users: ProfileBrief[];
};

const UserBriefList = ({ users }: UserBriefListProps) => {
	return (
		<div>
			{users.map(user => (
				<div key={user.id}>
					<UserIcon icon={user.profile_photo} size={UserIconSize.Medium} />
					<span>{user.username}</span>
				</div>
			))}
		</div>
	);
};

export default UserBriefList;
