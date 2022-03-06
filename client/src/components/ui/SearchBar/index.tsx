import React, { useMemo } from 'react';
import styles from './searchBar.module.scss';

type SearchBarProps = {
	value: string;
	onChange: (val: string) => void;
	placeholder?: string;
	onFocusChange?: (val: boolean) => void;
};

const SearchBar = ({
	value,
	onChange,
	placeholder,
	onFocusChange,
}: SearchBarProps) => {
	const searchValueEntered = useMemo(() => value.trim().length > 0, [value]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		onChange(event.target.value);

	const handleInputFocus = () => onFocusChange && onFocusChange(true);

	return (
		<div className={styles.searchFieldBox}>
			<input
				className={styles.searchField}
				type='text'
				onChange={handleInputChange}
				placeholder={placeholder ?? 'Input search query here..'}
				onFocus={handleInputFocus}
			/>
			<img
				className={styles.searchIcon}
				src='assets/search.svg'
				alt='search'
				style={{ opacity: searchValueEntered ? 1 : 0 }}
			/>
		</div>
	);
};

export default SearchBar;
