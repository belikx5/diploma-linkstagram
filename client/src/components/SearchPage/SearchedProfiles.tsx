import React, { useEffect, useState } from 'react';
import styles from './searchPage.module.scss';
import clx from 'classnames';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UserBriefCard } from '../User/UserBriefList';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { performSearch } from '../../store/actions/searchActions';
import { SEARCH_TYPES } from '../../store/actionTypes/searchActionTypes';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type Props = {
	searchValue: string;
};

const SearchedProfiles = ({ searchValue }: Props) => {
	const dispatch = useTypedDispatch();
	const [t] = useTranslation('common');
	const profiles = useTypedSelector(
		state => state.searchState.searchedProfiles
	);
	const searchLoading = useTypedSelector(
		state => state.searchState.searchLoading
	);
	const [isListEmpty, setIsListEmpty] = useState(false);
	useEffect(() => {
		dispatch(performSearch(searchValue, SEARCH_TYPES.PROFILES)).then(
			dataLength => {
				dataLength === 0 ? setIsListEmpty(true) : setIsListEmpty(false);
			}
		);
	}, []);
	return (
		<div>
			{isListEmpty ? (
				<h3 className={styles.searchContainerHeader}>
					{t('search.noProfiles')}
				</h3>
			) : (
				<>
					<h3 className={styles.searchContainerHeader}>
						{t('search.foundProfiles')}
					</h3>
					<div className={clx(styles.searchContainer, styles.profiles)}>
						{searchLoading ? (
							<CircularProgress size={30} />
						) : (
							profiles.map(user => (
								<div className={styles.userCardItem} key={user.id}>
									<UserBriefCard user={user} />
								</div>
							))
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default SearchedProfiles;
