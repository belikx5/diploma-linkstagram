import React, { useEffect, useState } from "react";
import styles from "./searchPage.module.scss";
import clx from "classnames";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { UserBriefCard } from "../User/UserBriefList";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { performSearch } from "../../store/actions/searchActions";
import { SEARCH_TYPES } from "../../store/actionTypes/searchActionTypes";
import { CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { UserIconSize } from "../../ts/enums";

type Props = {
  searchValue: string;
};

const SearchedProfiles = ({ searchValue }: Props) => {
  const dispatch = useTypedDispatch();
  const [t] = useTranslation("common");
  const profiles = useTypedSelector(
    (state) => state.searchState.searchedProfiles
  );
  const searchLoading = useTypedSelector(
    (state) => state.searchState.searchLoading
  );
  const [isListEmpty, setIsListEmpty] = useState(false);
  useEffect(() => {
    if (!profiles.length) setIsListEmpty(true);
    else setIsListEmpty(false);
  }, [profiles]);
  useEffect(() => {
    dispatch(performSearch(searchValue, SEARCH_TYPES.PROFILES)).then(
      (dataLength) => {
        dataLength === 0 ? setIsListEmpty(true) : setIsListEmpty(false);
      }
    );
  }, []);
  return (
    <div>
      {isListEmpty ? (
        <h3 className={styles.searchContainerHeader}>
          {t("search.noProfiles")}
        </h3>
      ) : (
        <>
          <h3 className={styles.searchContainerHeader}>
            {t("search.foundProfiles")}
          </h3>
          <div className={clx(styles.searchContainer, styles.profiles)}>
            {searchLoading ? (
              <CircularProgress size={30} />
            ) : (
              profiles.map((user) => (
                <div
                  className={clx(
                    styles.userCardItem,
                    user.tags.length && styles.withTags
                  )}
                  key={user.id}>
                  <UserBriefCard user={user} iconSize={UserIconSize.Medium} />
                  <div className={styles.tags}>
                    {user.tags?.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
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
