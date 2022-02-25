import './userBriefList.scss';
import React from 'react';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../UserIcon/UserIcon';

type UserBriefListProps = {
	users: ProfileBrief[];
};

const UserBriefList = ({ users }: UserBriefListProps) => {
	// useTypedDispatch
	// useEffect(()  => {

	// }, [])
	const uasers = [
		{ id: 1, username: '1', profile_photo: '', first_name: '', last_name: '' },
		{
			id: 2,
			username:
				'2asadadadsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
			profile_photo: '',
			first_name: '',
			last_name: '',
		},
		{ id: 3, username: '3', profile_photo: '', first_name: '', last_name: '' },
		{ id: 4, username: '4', profile_photo: '', first_name: '', last_name: '' },
		{ id: 5, username: '5', profile_photo: '', first_name: '', last_name: '' },
	];

	return (
		<div className='user-brief-list'>
			{uasers.map(user => (
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
		</div>
	);
};

export default UserBriefList;
