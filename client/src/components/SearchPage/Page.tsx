import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './searchPage.module.scss';
import clx from 'classnames';
import { useQuery } from '../../hooks/useQuery';
import { SEARCH_TYPES } from '../../store/actionTypes/searchActionTypes';
import { SearchedProfiles, SearchedPosts } from '.';
import UserCard from '../User/UserCard/UserCard';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const Page = () => {
	const query = useQuery();
	const currentUser = useTypedSelector(state => state.userState.currentUser);
	const type = useMemo(() => {
		const type = query.get('type');
		return typeof type === 'string' &&
			Object.values(SEARCH_TYPES).find(el => el === type)
			? type
			: null;
	}, [query]);
	const searchValue = useMemo(() => query.get('value') ?? '', [query]);

	if (!type)
		return (
			<div className={styles.emptySearchType}>
				There is nothing to search here, please return to the{' '}
				<Link to='/'>Home</Link> page
			</div>
		);

	return (
		<div className={styles.searchPage}>
			<div>
				{type === SEARCH_TYPES.PROFILES && (
					<SearchedProfiles searchValue={searchValue} />
				)}
				{type === SEARCH_TYPES.POSTS && (
					<SearchedPosts searchValue={searchValue} />
				)}
			</div>
			{currentUser && (
				<div
					className={clx(
						styles.asideUserCard,
						type === SEARCH_TYPES.POSTS && styles.posts
					)}>
					<UserCard isProfilePage={false} isCurrentUser={true} />
				</div>
			)}
		</div>
	);
};

export default Page;
