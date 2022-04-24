import { ThunkActionVoid, ThunkActionWithPromise } from "..";
import api from "../../services/api";
import http from "../../services/http";
import {
  SEARCH_TYPES,
  SET_SEARCH_TYPE,
  SET_SEARCH_VALUE,
  FETCH_SEARCHED_PROFILES,
  FETCH_SEARCHED_POSTS,
  SET_SEARCH_LOADING,
} from "../actionTypes/searchActionTypes";
import { USER_ACTION_ERROR } from "../actionTypes/userActionTypes";

export const setSearchValue =
  (value: string): ThunkActionVoid =>
  (dispatch) => {
    dispatch({
      type: SET_SEARCH_VALUE,
      payload: value,
    });
  };

export const setSearchType =
  (value: SEARCH_TYPES): ThunkActionVoid =>
  (dispatch) => {
    dispatch({
      type: SET_SEARCH_TYPE,
      payload: value,
    });
  };

export const setSearchLoading =
  (value: boolean): ThunkActionVoid =>
  (dispatch) => {
    dispatch({
      type: SET_SEARCH_LOADING,
      payload: value,
    });
  };

export const performSearch =
  (searchValue: string, searchType: string): ThunkActionWithPromise<number> =>
  async (dispatch) => {
    dispatch(setSearchLoading(true));
    const searchConfig = { endpoint: "", dispatchType: "", ordering: "" };
    if (searchType === SEARCH_TYPES.PROFILES) {
      searchConfig.endpoint = api.USERS;
      searchConfig.dispatchType = FETCH_SEARCHED_PROFILES;
    } else if (searchType === SEARCH_TYPES.POSTS) {
      searchConfig.endpoint = api.POSTS;
      searchConfig.dispatchType = FETCH_SEARCHED_POSTS;
      searchConfig.ordering = "ordering=-created_at";
    }
    try {
      const resp = await http.get(
        `${searchConfig.endpoint}?search=${searchValue}&${searchConfig.ordering}`
      );
      dispatch({
        type: searchConfig.dispatchType,
        payload: resp.data,
      });
      return Promise.resolve(resp.data.length);
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Search failed",
        },
      });
      return Promise.reject(0);
    } finally {
      dispatch(setSearchLoading(false));
    }
  };
