import './postDetails.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserIconSize } from '../../../ts/enums';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	addComment,
	fetchPostById,
	removeLike,
	resetCurrentPost,
	setLike,
	setPostActionError,
} from '../../../store/actions/postActions';
import { Post } from '../../../store/actionTypes/postActionTypes';
import { sortCommentsDesc } from '../../../services/sorting';
import { useTranslation } from 'react-i18next';

import UserIcon from '../../User/UserIcon/UserIcon';
import Comment from '../PostComment/Comment';
import Slider from '../../Slider';
import { CircularProgress } from '@material-ui/core';

type PostDetailsProps = {
	postData: Post;
	openModal: Function;
};

const PostDetails = ({ postData, openModal }: PostDetailsProps) => {
	const [t] = useTranslation('common');
	const dispatch = useDispatch();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const currentPost = useTypedSelector(state => state.postsState.currentPost);
	const [text, setText] = useState('');
	const onCommentSend = () => {
		if (text.trim() && currentPost) {
			dispatch(addComment(currentPost.id, text));
			setText('');
		} else dispatch(setPostActionError("Comment can't be empty"));
	};
	const onLikeClick = () => {
		if (currentPost)
			currentPost.is_liked
				? dispatch(removeLike(currentPost))
				: dispatch(setLike(currentPost.id));
	};

	const requireAuthForAction = (action: Function) => {
		if (currentUser?.username) {
			action();
		} else dispatch(setPostActionError('Login to perform this action'));
	};

	useEffect(() => {
		dispatch(fetchPostById(postData.id));

		return () => {
			dispatch(resetCurrentPost());
		};
	}, []);

	if (!currentPost) return <CircularProgress size={30} />;

	return (
		<div className='post-details'>
			<Slider
				images={currentPost.images.map(p => p.image)}
				isPostDetails={true}
			/>
			<div className='post-details-data'>
				<div className='post-details-header'>
					<div>
						<UserIcon
							icon={currentPost.author.profile_photo}
							size={UserIconSize.Small}
						/>
						<p>{currentPost.author.username}</p>
					</div>
					<img
						className='post-details-header-close'
						src='../../assets/close.svg'
						onClick={() => openModal(false)}
						alt='close-icon'
					/>
				</div>
				<div className='post-details-comments'>
					{sortCommentsDesc(currentPost.comments)?.map((comment, index) => {
						return <Comment key={index} data={comment} showAuthor />;
					})}
				</div>
				<div
					className='post-details-likes'
					onClick={() => requireAuthForAction(onLikeClick)}>
					<img
						src={`../../assets/like-${
							currentPost.is_liked ? 'red' : 'grey'
						}.svg`}
						alt='is-liked'
					/>
					<p className='post-details-total-likes'>{currentPost.likes_count}</p>
				</div>
				<div className='post-details-actions'>
					<textarea
						placeholder={t('post.addComment')}
						className='post-details-input-field'
						value={text}
						onChange={e => setText(e.target.value)}
					/>
					<button
						className='post-details-action-button'
						onClick={() => requireAuthForAction(onCommentSend)}>
						{t('common.post')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
