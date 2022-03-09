import './userCard.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserIcon from '../UserIcon/UserIcon';
import { UserIconSize } from '../../../ts/enums';

import history from '../../../services/history';
import Modal from '../../ui/Modal/Modal';
import EditForm from '../EditProfile/EditForm';
import CreatePostForm from '../../Post/CreatePost/CreatePostForm';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { openCreatePostModal } from '../../../store/actions/postActions';
import UserFollowing from './UserFollowing';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { follow, unfollow } from '../../../store/actions/userActions';

type UserCardProps = {
	isProfilePage: boolean;
	isCurrentUser: boolean;
};

const UserCard = ({ isProfilePage, isCurrentUser }: UserCardProps) => {
	const dispatch = useTypedDispatch();
	const [t] = useTranslation('common');
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const anotherUserProfile = useTypedSelector(
		state => state.userState.anotherUserProfile
	);
	const user = isCurrentUser ? currentUser : anotherUserProfile;
	const createModalOpened = useTypedSelector(
		state => state.postsState.createModalOpened
	);
	const [modalEditOpen, setModalEditOpen] = useState(false);
	const toggleCreateModal = (value: boolean) => {
		dispatch(openCreatePostModal(value));
	};

	const onEditClick = () => {
		if (history.location.pathname === '/') {
			setModalEditOpen(true);
		} else {
			history.push('/edit-post');
		}
	};
	const onCreateClick = () => {
		if (history.location.pathname === '/') {
			toggleCreateModal(true);
		} else {
			history.push('/create-post');
		}
	};
	const onSendMessageClick = () => {
		history.push('/messages');
	};
	const onFollowClick = (uid: number) => dispatch(follow(uid));

	const onUnfollowClick = (uid: number) => dispatch(unfollow(uid));

	return (
		<>
			{modalEditOpen && (
				<Modal modalMarginTop={15} openModal={setModalEditOpen}>
					<EditForm openModal={setModalEditOpen} />
				</Modal>
			)}
			{createModalOpened && (
				<Modal modalMarginTop={15} openModal={toggleCreateModal}>
					<CreatePostForm setModalOpen={toggleCreateModal} />
				</Modal>
			)}
			<div className='user-card'>
				<div className='user-card-header'>
					<UserFollowing
						isCurrentUserList={isCurrentUser}
						isFollowersList
						usersCount={user?.followers_count}
					/>
					<div className='user-card-header-image'>
						<UserIcon icon={user?.profile_photo} size={UserIconSize.Large} />
						{!isProfilePage && (
							<img
								className='user-card-header-image-plus'
								src='../../assets/ava-plus.svg'
								alt='plus'
							/>
						)}
					</div>
					<UserFollowing
						isCurrentUserList={isCurrentUser}
						isFollowersList={false}
						usersCount={user?.following_count}
					/>
				</div>
				<p className='user-card-author-main'>
					{user?.username}
					<br />
					{(user?.first_name || user?.last_name) && (
						<>
							-
							<br />
							{user?.first_name} {user?.last_name}
						</>
					)}
				</p>
				<p className='user-card-author-description'>{user?.bio}</p>
				{isCurrentUser ? (
					<div className='user-card-actions'>
						<button
							onClick={onEditClick}
							className={isProfilePage ? 'wide' : ''}>
							{t('userCard.edit')}
						</button>
						<button
							onClick={onCreateClick}
							className={isProfilePage ? 'wide' : ''}>
							{t('userCard.new')}
						</button>
					</div>
				) : (
					user && (
						<div className='user-card-actions'>
							<button
								onClick={onSendMessageClick}
								className={isProfilePage ? 'wide' : ''}>
								{t('userCard.sendMessage')}
							</button>
							<button
								onClick={
									user.is_following
										? () => onUnfollowClick(user.id)
										: () => onFollowClick(user.id)
								}
								className={isProfilePage ? 'wide' : ''}>
								{t(`userCard.${user.is_following ? 'unfollow' : 'follow'}`)}
							</button>
						</div>
					)
				)}
				{!isProfilePage && (
					<div className='user-card-terms'>
						<p>{t('userCard.smallText')}</p>
						<p>&#169; 2020 Linkstagram</p>
					</div>
				)}
			</div>
		</>
	);
};

export default UserCard;
