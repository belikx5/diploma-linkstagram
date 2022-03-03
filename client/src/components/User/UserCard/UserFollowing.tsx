import React from 'react';
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
	const user = useTypedSelector(
		state =>
			state.userState[isCurrentUserList ? 'currentUser' : 'anotherUserProfile']
	);
	const followingModalOpened = useTypedSelector(
		state => state.userState.followingModalOpened
	);

	const toggleUserFollowingModal = (value: boolean) => {
		dispatch(openUserFollowingModal(isFollowersList, value));
	};

	const openModal = () => {
		if (!user) return;
		const fetchConfig = { userId: user.id, isCurrentUser: isCurrentUserList };
		isFollowersList
			? dispatch(
					fetchUserFollowers(fetchConfig.userId, fetchConfig.isCurrentUser)
			  )
			: dispatch(
					fetchUserFollowing(fetchConfig.userId, fetchConfig.isCurrentUser)
			  );
		toggleUserFollowingModal(true);
	};

	return (
		<>
			{followingModalOpened.isFollowersModal === isFollowersList &&
				followingModalOpened.value && (
					<Modal modalMarginTop={15} openModal={toggleUserFollowingModal}>
						<UserBriefList
							users={users}
							toggleModal={toggleUserFollowingModal}
						/>
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
