import React, { useMemo } from "react";
import styles from "./searchBar.module.scss";
import { CircularProgress } from "@material-ui/core";

type SearchBarProps = {
  value: string;
  onChange: (val: string) => void;
  onSearchClick: () => void;
  placeholder?: string;
  onFocusChange?: (val: boolean) => void;
  loading?: boolean;
};

const SearchBar = ({
  value,
  onChange,
  onSearchClick,
  placeholder,
  onFocusChange,
  loading,
}: SearchBarProps) => {
  const searchValueEntered = useMemo(() => value.trim().length > 0, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  const handleInputFocus = () => onFocusChange && onFocusChange(true);

  const hadnleSearchClick = () => onSearchClick();

  return (
    <div className={styles.searchFieldBox}>
      <input
        className={styles.searchField}
        type='text'
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder ?? "Input search query here.."}
        onFocus={handleInputFocus}
      />
      {loading ? (
        <CircularProgress size={30} />
      ) : (
        <img
          onClick={hadnleSearchClick}
          className={styles.searchIcon}
          src='assets/search.svg'
          alt='search'
          style={{ opacity: searchValueEntered ? 1 : 0 }}
        />
      )}
    </div>
  );
};

export default SearchBar;
