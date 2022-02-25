import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	fetchUserFollowers,
	fetchUserFollowing,
	openUserFollowingModal,
} from '../../../store/actions/userActions';
import Modal from '../../ui/Modal/Modal';
import UserBriefList from '../UserBriefList';

type UserFollowingFollowersProps = {
	isFollowersList: boolean;
	isCurrentUserList: boolean;
	usersCount: number | undefined;
};

const UserFollowing = ({
	isFollowersList,
	isCurrentUserList = false,
	usersCount = 0,
}: UserFollowingFollowersProps) => {
	const [t] = useTranslation('common');
	const dispatch = useTypedDispatch();
	const users = useTypedSelector(
		state => state.userState[isFollowersList ? 'followers' : 'following']
	);
	const currUser = useTypedSelector(state => state.userState.currentUser);
	const followingModalOpened = useTypedSelector(
		state => state.userState.followingModalOpened
	);

	const [currentListOpened, setCurrentListOpened] = useState(false);

	const toggleUserFollowingModal = (value: boolean) => {
		dispatch(openUserFollowingModal(isFollowersList, value));
		console.log('toggle triggered');
	};

	const openModal = () => {
		const fetchConfig =
			isCurrentUserList && currUser
				? {
						userId: currUser.id,
						isCurrentUser: true,
				  }
				: {
						userId: 1,
						isCurrentUser: false,
				  };
		isFollowersList
			? dispatch(
					fetchUserFollowers(fetchConfig.userId, fetchConfig.isCurrentUser)
			  )
			: dispatch(
					fetchUserFollowing(fetchConfig.userId, fetchConfig.isCurrentUser)
			  );
		toggleUserFollowingModal(true);
		setCurrentListOpened(true);
	};

	console.log({ users });

	return (
		<>
			{followingModalOpened.isFollowersModal === isFollowersList &&
				followingModalOpened.value && (
					<Modal modalMarginTop={15} openModal={toggleUserFollowingModal}>
						<UserBriefList users={users} />
					</Modal>
				)}
			<div
				onClick={openModal}
				className={`user-card-header-${
					isFollowersList ? 'followers' : 'following'
				}`}>
				<p>{usersCount}</p>
				<p>{t(`userCard.${isFollowersList ? 'followers' : 'following'}`)}</p>
			</div>
		</>
	);
};

export default UserFollowing;
