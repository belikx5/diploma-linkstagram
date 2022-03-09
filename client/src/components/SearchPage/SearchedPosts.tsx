import React, { useEffect, useState } from 'react';
import styles from './searchPage.module.scss';
import clx from 'classnames';
import { CircularProgress } from '@material-ui/core';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { performSearch } from '../../store/actions/searchActions';
import { SEARCH_TYPES } from '../../store/actionTypes/searchActionTypes';
import Post from '../Post/PostItem/Post';
import { useTranslation } from 'react-i18next';

type Props = {
	searchValue: string;
};

const SearchedPosts = ({ searchValue }: Props) => {
	const dispatch = useTypedDispatch();
	const [t] = useTranslation('common');
	const posts = useTypedSelector(state => state.searchState.searchedPosts);
	const searchLoading = useTypedSelector(
		state => state.searchState.searchLoading
	);
	const [isListEmpty, setIsListEmpty] = useState(false);

	useEffect(() => {
		dispatch(performSearch(searchValue, SEARCH_TYPES.POSTS)).then(
			dataLength => {
				dataLength === 0 ? setIsListEmpty(true) : setIsListEmpty(false);
			}
		);
	}, []);
	return (
		<div>
			{isListEmpty ? (
				<h3 className={styles.searchContainerHeader}>{t('search.noPosts')}</h3>
			) : (
				<>
					<h3 className={styles.searchContainerHeader}>
						{t('search.foundPosts')}
					</h3>
					<div className={clx(styles.searchContainer, styles.posts)}>
						{searchLoading ? (
							<CircularProgress size={30} />
						) : (
							posts.map(post => <Post key={post.id} postData={post} />)
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default SearchedPosts;
