import './profile.scss';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserCard from '../UserCard/UserCard';
import OwnerPostList from '../../Post/OwnerPostList/OwnerPostList';
import Loading from '../../ui/Loading/Loading';
import UserCardProfile from '../UserCard/UserCardProfile';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { fetchUserById } from '../../../store/actions/userActions';
import { fetchPostByUser } from '../../../store/actions/postActions';
import { useParams } from 'react-router-dom';

type ProfileProps = {
	isCurrentUser: boolean;
};

type ProfilePageParams = {
	id: string | undefined;
};

const Profile = ({ isCurrentUser }: ProfileProps) => {
	const dispatch = useDispatch();
	const { id: otherUserId } = useParams<ProfilePageParams>();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const postsByUser = useTypedSelector(state => state.postsState.postsByUser);

	const userCardProps = {
		isProfilePage: true,
		isCurrentUser,
	};

	useEffect(() => {
		if (otherUserId) {
			const uid = +otherUserId;
			dispatch(fetchUserById(uid));
			dispatch(fetchPostByUser(uid));
		}
	}, [otherUserId]);

	useEffect(() => {
		if (isCurrentUser && currentUser) dispatch(fetchPostByUser(currentUser.id));
	}, [currentUser, isCurrentUser]);

	if (isCurrentUser && !currentUser && !postsByUser.length) {
		return <Loading />;
	}

	return (
		<>
			<div className='profile mobile'>
				<UserCard {...userCardProps} />
				<OwnerPostList posts={postsByUser} />
			</div>
			<div className='profile desktop'>
				<UserCardProfile {...userCardProps} />
				<OwnerPostList posts={postsByUser} />
			</div>
		</>
	);
};

export default Profile;
