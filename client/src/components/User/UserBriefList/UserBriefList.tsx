import React from 'react';
import styles from './userBrief.module.scss';
import { ProfileBrief } from '../../../store/actionTypes/userActionTypes';
import { UserBriefCard } from '.';

type UserBriefListProps = {
	users: ProfileBrief[];
	toggleModal?: (val: boolean) => void;
};

const UserBriefList = ({ users, toggleModal }: UserBriefListProps) => {
	const handleUserClick = (uid: number) => {
		toggleModal && toggleModal(false);
	};

	return (
		<div className={styles.userBriefList}>
			{users.map(user => (
				<UserBriefCard
					key={user.id}
					user={user}
					onUserClick={handleUserClick}
				/>
			))}
			{!users.length && <p>Users not found...</p>}
		</div>
	);
};

export default UserBriefList;
