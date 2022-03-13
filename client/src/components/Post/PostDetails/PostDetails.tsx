import './postDetails.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserIconSize } from '../../../ts/enums';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
	addComment,
	editPostValues,
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
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';

type PostDetailsProps = {
	postData: Post;
	openModal: Function;
};

const PostDetails = ({ postData, openModal }: PostDetailsProps) => {
	const [t] = useTranslation('common');
	const dispatch = useTypedDispatch();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const currentPost = useTypedSelector(state => state.postsState.currentPost);
	const isCurrUserAuthor = useMemo(
		() => currentPost?.author?.id === currentUser?.id,
		[currentPost, currentUser]
	);
	const [text, setText] = useState('');
	const [description, setDescription] = useState('');
	const [editableValChanged, setEditableValChanged] = useState(false);
	const [tagValue, setTagValue] = useState('');
	const [tags, setTags] = useState<string[]>([]);

	const onEditSave = () => {
		if (!currentPost) return;
		dispatch(editPostValues(currentPost.id, description, tags)).then(() =>
			setEditableValChanged(false)
		);
	};
	const onNewTagAdd = () => {
		if (tags.find(t => t === tagValue)) return;
		setTags([...tags, tagValue]);
		setTagValue('');
		setEditableValChanged(true);
	};
	const onTagRemove = (tag: string) => {
		setTags(tags.filter(t => t !== tag));
		setEditableValChanged(true);
	};
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
		if (currentPost) {
			setDescription(currentPost.description);
			setTags(currentPost.tags);
		}
	}, [currentPost]);

	useEffect(() => {
		if (!currentPost) return;
		description === currentPost.description
			? setEditableValChanged(false)
			: setEditableValChanged(true);
	}, [description, currentPost]);

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
				<div className='post-details-tags'>
					{isCurrUserAuthor && (
						<div className='create-tag'>
							<img
								src='/assets/ava-plus.svg'
								className='tag-action-icon'
								alt='add'
								onClick={onNewTagAdd}
							/>
							<input
								value={tagValue}
								onChange={e => setTagValue(e.target.value)}
							/>
						</div>
					)}
					{tags.map((tag, i) =>
						isCurrUserAuthor ? (
							<div key={tag} className='tag'>
								{tag}
								<img
									src='/assets/close.svg'
									className='tag-action-icon'
									alt='delete'
									onClick={() => onTagRemove(tag)}
								/>
							</div>
						) : (
							<div key={tag} className='tag'>
								{tag}
							</div>
						)
					)}
				</div>
				<div className='post-details-likes'>
					<img
						src={`../../assets/like-${
							currentPost.is_liked ? 'red' : 'grey'
						}.svg`}
						onClick={() => requireAuthForAction(onLikeClick)}
						alt='is-liked'
					/>
					<p className='post-details-total-likes'>{currentPost.likes_count}</p>
					<textarea
						className='post-details-description'
						value={description}
						disabled={!isCurrUserAuthor}
						onChange={e => setDescription(e.target.value)}
					/>
					<button
						className='post-details-action-button'
						style={{
							visibility:
								editableValChanged && isCurrUserAuthor ? 'visible' : 'hidden',
						}}
						disabled={!isCurrUserAuthor}
						onClick={onEditSave}>
						{t('common.save')}
					</button>
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
