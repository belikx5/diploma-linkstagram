import React, { useCallback, useState } from 'react';
import { useHandleClickOutside } from '../../hooks/useHandleClickOutside';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import history from '../../services/history';
import {
	performSearch,
	setSearchType,
	setSearchValue,
} from '../../store/actions/searchActions';
import { SEARCH_TYPES } from '../../store/actionTypes/searchActionTypes';
import SearchBar from '../ui/SearchBar';

const searchTypesArr = [SEARCH_TYPES.PROFILES, SEARCH_TYPES.POSTS];

const SearchForInterests = () => {
	const dispatch = useTypedDispatch();
	const searchValue = useTypedSelector(state => state.searchState.searchValue);
	const searchType = useTypedSelector(state => state.searchState.searchType);
	const searchLoading = useTypedSelector(
		state => state.searchState.searchLoading
	);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [containerRef] = useHandleClickOutside(setIsSearchFocused);

	const handleSearchValueChange = useCallback(
		(newVal: string) => {
			dispatch(setSearchValue(newVal));
		},
		[dispatch]
	);

	const handleSearchClick = useCallback(() => {
		dispatch(performSearch(searchValue, searchType)).then(res => {
			history.push(`/search?type=${searchType}`);
		});
	}, [dispatch, searchValue, searchType]);

	const handleTypeClick = useCallback(
		(newVal: SEARCH_TYPES) => {
			dispatch(setSearchType(newVal));
		},
		[dispatch]
	);

	return (
		<div className='search-input'>
			<SearchBar
				value={searchValue}
				onChange={handleSearchValueChange}
				onSearchClick={handleSearchClick}
				placeholder='Search...'
				onFocusChange={setIsSearchFocused}
				loading={searchLoading}
			/>
			<div
				ref={containerRef}
				className={`search-types ${isSearchFocused && 'visible'}`}>
				{searchTypesArr.map(type => (
					<div
						onClick={() => handleTypeClick(type)}
						className={`chips ${type === searchType && 'selected'}`}>
						{type}
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchForInterests;
