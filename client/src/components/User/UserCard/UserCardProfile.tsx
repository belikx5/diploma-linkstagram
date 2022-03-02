import './userCard.scss';
import React from 'react';
import UserIcon from '../UserIcon/UserIcon';
import { UserIconSize } from '../../../ts/enums';

import history from '../../../services/history';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useTranslation } from 'react-i18next';
import UserFollowing from './UserFollowing';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { follow, unfollow } from '../../../store/actions/userActions';

type UserCardProps = {
	isProfilePage: boolean;
	isCurrentUser: boolean;
};

const UserCard = ({ isProfilePage, isCurrentUser }: UserCardProps) => {
	const [t] = useTranslation('common');
	const dispatch = useTypedDispatch();
	const currentUser = useTypedSelector(state => state.userState.currentUser);

	const anotherUserProfile = useTypedSelector(
		state => state.userState.anotherUserProfile
	);
	const user = isCurrentUser ? currentUser : anotherUserProfile;

	const onEditClick = () => {
		history.push('/edit');
	};
	const onCreateClick = () => {
		history.push('/create');
	};
	const onSendMessageClick = () => {
		history.push('/messages');
	};
	const onFollowClick = (uid: number) => dispatch(follow(uid));

	const onUnfollowClick = (uid: number) => dispatch(unfollow(uid));

	return (
		<>
			<div className='user-card-profile'>
				<div className='user-card-left'>
					<div className='user-card-header-image'>
						<UserIcon icon={user?.profile_photo} size={UserIconSize.Large} />
					</div>
					<div className='user-card-left-data'>
						<h3>{user?.username}</h3>
						{user?.first_name} {user?.last_name}
						<p className='user-card-left-data-descr'>{user?.bio}</p>
					</div>
				</div>
				<div className='user-card-right'>
					<div className='user-card-right-stats'>
						<UserFollowing
							isCurrentUserList={isCurrentUser}
							isFollowersList
							usersCount={user?.followers_count}
						/>
						<UserFollowing
							isCurrentUserList={isCurrentUser}
							isFollowersList={false}
							usersCount={user?.following_count}
						/>
					</div>
					{isCurrentUser ? (
						<div className='user-card-right-actions'>
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
							<div className='user-card-right-actions'>
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
				</div>
			</div>
		</>
	);
};

export default UserCard;
