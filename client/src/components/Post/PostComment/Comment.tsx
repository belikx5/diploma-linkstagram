import './comment.scss';
import React from 'react';
import UserIcon from '../../User/UserIcon/UserIcon';
import { UserIconSize } from '../../../ts/enums';
import { formateDate } from '../../../services/moment';
import { Comment as CommentType } from '../../../store/actionTypes/postActionTypes';

type CommentProps = {
	data: CommentType;
	showAuthor?: boolean;
};

const Comment = ({ data, showAuthor = false }: CommentProps) => {
	return (
		<div className='comment'>
			<div>
				<UserIcon icon={data.user.profile_photo} size={UserIconSize.Small} />
				<div className={`comment-data  ${showAuthor ? 'showAuthor' : ''}`}>
					<p className='comment-data-text'>{data.message}</p>
					<div className='comment-data-meta'>
						{showAuthor && (
							<p className='comment-data-author'>{data.user.username}</p>
						)}
						<p>
							{data.created_at ? formateDate(Date.parse(data.created_at)) : 1}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
