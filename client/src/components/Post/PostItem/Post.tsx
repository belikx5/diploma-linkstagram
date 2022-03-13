import './post.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formateDate } from '../../../services/moment';
import {
	setLike,
	removeLike,
	fetchComments,
	deletePost,
	openPostDetailsModal,
	editPostValues,
} from '../../../store/actions/postActions';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { Post as PostType } from '../../../store/actionTypes/postActionTypes';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserIconSize } from '../../../ts/enums';
import UserIcon from '../../User/UserIcon/UserIcon';
import PostDetails from '../PostDetails/PostDetails';
import DropdownMenu from '../PostDropdown/DropdownMenu';
import Modal from '../../ui/Modal/Modal';
import Slider from '../../Slider';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';

type PostProps = {
	postData: PostType;
	showPostActions?: boolean;
	editable?: boolean;
};

const Post = ({
	postData,
	showPostActions = true,
	editable = false,
}: PostProps) => {
	const [t] = useTranslation('common');
	const dispatch = useTypedDispatch();
	const history = useHistory();
	const { pathname } = useLocation();
	const [copiedShown, setCopiedShown] = useState(false);
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const detailsModalOpened = useTypedSelector(
		state => state.postsState.detailsModalOpened
	);
	const isCurrUserAuthor = useMemo(
		() => postData.author.id === currentUser?.id,
		[postData, currentUser]
	);
	const [description, setDescription] = useState(postData.description);
	const [editableValChanged, setEditableValChanged] = useState(false);
	const [tagValue, setTagValue] = useState('');
	const [tags, setTags] = useState<string[]>(postData.tags);

	const onEditSave = () => {
		dispatch(editPostValues(postData.id, description, tags)).then(() =>
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

	const handleLikeClick = () => {
		postData.is_liked
			? dispatch(removeLike(postData))
			: dispatch(setLike(postData.id));
	};
	const isModalOpened = (value: boolean) => {
		dispatch(openPostDetailsModal(postData.id, value));
	};
	const navigateToPostView = () => {
		history.push(`/postDetails/${postData.id}`);
	};
	const validateLocationForAction = (action: () => void) => {
		!pathname.includes('/postDetails') && action();
	};
	const handleShareClick = () => {
		setCopiedShown(true);
		navigator.clipboard.writeText(`http://localhost:3000/#${postData.id}`);
		setTimeout(() => {
			setCopiedShown(false);
		}, 1200);
	};
	const postDetailsProps = {
		openModal: isModalOpened,
		postData,
	};

	useEffect(() => {
		description === postData.description
			? setEditableValChanged(false)
			: setEditableValChanged(true);
	}, [description, postData]);

	useEffect(() => {
		dispatch(fetchComments(postData.id));
	}, []);

	return (
		<>
			{detailsModalOpened.value && postData.id === detailsModalOpened.postId && (
				<Modal modalMarginTop={20} openModal={isModalOpened}>
					<PostDetails {...postDetailsProps} />
				</Modal>
			)}
			<div className='post'>
				<div className='post-header'>
					<div>
						{postData.author.username === currentUser?.username ? (
							<UserIcon
								icon={currentUser?.profile_photo}
								size={UserIconSize.Small}
							/>
						) : (
							<UserIcon
								icon={postData.author.profile_photo}
								size={UserIconSize.Small}
							/>
						)}
						<div className='post-header-data'>
							<p>{postData.author.username}</p>
							<p>{formateDate(Date.parse(postData.created_at))}</p>
						</div>
					</div>
					{postData.author.username === currentUser?.username && (
						<DropdownMenu
							deletePost={() => dispatch(deletePost(postData.id))}
						/>
					)}
				</div>
				<div className='post-image-block'>
					<div className='post-details-button desktop'>
						<Slider
							images={postData.images.map(el => el.image)}
							onImageClick={() =>
								validateLocationForAction(() => isModalOpened(true))
							}
						/>
					</div>
					<div className='post-details-button mobile'>
						<Slider
							images={postData.images.map(el => el.image)}
							onImageClick={() => validateLocationForAction(navigateToPostView)}
						/>
					</div>
					{copiedShown && (
						<div className='post-copied-bufer'>
							<img src='../../assets/copied.svg' alt='copied' />
							<p className='post-copied-bufer-text'>{t('post.copied')}</p>
						</div>
					)}
				</div>
				{editable ? (
					<div className='post-description-editable'>
						<textarea
							className='post-description-editable-txtarea'
							value={description}
							disabled={!isCurrUserAuthor}
							onChange={e => setDescription(e.target.value)}
						/>
						<button
							className='post-action-button'
							disabled={!isCurrUserAuthor}
							onClick={onEditSave}
							style={{
								visibility:
									editableValChanged && isCurrUserAuthor ? 'visible' : 'hidden',
							}}>
							{t('common.save')}
						</button>
					</div>
				) : (
					<p className='post-description'>{postData.description}</p>
				)}
				<div className='post-tags'>
					{editable && isCurrUserAuthor && (
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
						editable && isCurrUserAuthor ? (
							<div key={tag} className='post-tags-tag'>
								{tag}
								<img
									src='/assets/close.svg'
									className='tag-action-icon'
									alt='delete'
									onClick={() => onTagRemove(tag)}
								/>
							</div>
						) : (
							<div key={tag} className='post-tags-tag'>
								{tag}
							</div>
						)
					)}
				</div>
				{showPostActions && (
					<div className='post-actions'>
						<div>
							<div className='post-action' onClick={handleLikeClick}>
								<img
									src={`../../assets/like-${
										postData.is_liked ? 'red' : 'grey'
									}.svg`}
									alt='is-liked'
								/>
								<p>{postData.likes_count}</p>
							</div>
							<div
								className='post-action comment-action post-details-button desktop'
								onClick={() =>
									validateLocationForAction(() => isModalOpened(true))
								}>
								<img src='../../assets/comment.svg' alt='comment' />
								<p>{postData.comments?.length || 0}</p>
							</div>
							<div
								className='post-action comment-action post-details-button mobile'
								onClick={() => validateLocationForAction(navigateToPostView)}>
								<img src='../../assets/comment.svg' alt='comment' />
								<p>{postData.comments?.length || 0}</p>
							</div>
						</div>
						<div className='post-action' onClick={handleShareClick}>
							<p>{t('post.share')}</p>
							<img src='../../assets/arrow-right.svg' alt='share' />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Post;
