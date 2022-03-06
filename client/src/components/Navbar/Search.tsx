import React, { useCallback, useState } from 'react';
import { useHandleClickOutside } from '../../hooks/useHandleClickOutside';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import {
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
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [containerRef] = useHandleClickOutside(setIsSearchFocused);

	const handleSearchValueChange = useCallback(
		(newVal: string) => {
			dispatch(setSearchValue(newVal));
		},
		[dispatch]
	);

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
				placeholder='Search...'
				onFocusChange={setIsSearchFocused}
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
