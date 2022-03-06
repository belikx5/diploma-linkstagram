import { ThunkActionVoid } from '..';
import {
	SEARCH_TYPES,
	SET_SEARCH_TYPE,
	SET_SEARCH_VALUE,
} from '../actionTypes/searchActionTypes';

export const setSearchValue =
	(value: string): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: SET_SEARCH_VALUE,
			payload: value,
		});
	};

export const setSearchType =
	(value: SEARCH_TYPES): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: SET_SEARCH_TYPE,
			payload: value,
		});
	};
