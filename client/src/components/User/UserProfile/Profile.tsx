import './profile.scss';
import React, { useEffect, useState } from 'react';
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

const MOBILE_MATCH_MEDIA = '(max-width: 1100px)';

const Profile = ({ isCurrentUser }: ProfileProps) => {
	const dispatch = useDispatch();
	const { id: otherUserId } = useParams<ProfilePageParams>();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const postsByUser = useTypedSelector(state => state.postsState.postsByUser);
	const [isMobileSize, setIsMobileSize] = useState(
		window.matchMedia(MOBILE_MATCH_MEDIA).matches
	);

	const userCardProps = {
		isProfilePage: true,
		isCurrentUser,
	};

	const resizeListener = () => {
		const mobileScreenSize = window.matchMedia(MOBILE_MATCH_MEDIA).matches;
		setIsMobileSize(mobileScreenSize);
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

	useEffect(() => {
		window.addEventListener('resize', resizeListener);
		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	if (isCurrentUser && !currentUser && !postsByUser.length) {
		return <Loading />;
	}

	return isMobileSize ? (
		<div className='profile mobile'>
			<UserCard {...userCardProps} />
			<OwnerPostList posts={postsByUser} isCurrentUser={isCurrentUser} />
		</div>
	) : (
		<div className='profile desktop'>
			<UserCardProfile {...userCardProps} />
			<OwnerPostList posts={postsByUser} isCurrentUser={isCurrentUser} />
		</div>
	);
};

export default Profile;
