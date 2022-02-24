import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import api from '../../services/api';
import http from '../../services/http';
import history from '../../services/history';
import {
	CLEAR_DATA,
	AUTH_ERROR,
	SIGN_IN,
	SIGN_UP,
	UserDispatchTypes,
	FETCH_CURRENT_USER,
	Profile,
	EDIT_USER,
	ProfileToEdit,
	FETCH_ALL_USERS,
	CLEAR_AUTH_ERROR,
	CLEAR_USER_ACTION_ERROR,
	USER_ACTION_ERROR,
	FOLLOWING_MODAL_OPENED,
	FETCH_FOLLOWING,
	ProfileBrief,
} from '../actionTypes/userActionTypes';
import { enqueueSnackbar, successSnackbarConfig } from './uiActions';
import { ThunkActionWithPromise, RootStore, ThunkActionVoid } from '..';

export const logout = () => (dispatch: Dispatch<UserDispatchTypes>) => {
	localStorage.removeItem('token');
	dispatch({ type: CLEAR_DATA });
};

export const clearAuthError = () => (dispatch: Dispatch<UserDispatchTypes>) => {
	dispatch({ type: CLEAR_AUTH_ERROR });
};
export const clearUserActionError =
	() => (dispatch: Dispatch<UserDispatchTypes>) => {
		dispatch({ type: CLEAR_USER_ACTION_ERROR });
	};
export const tryLocalSignIn =
	() => async (dispatch: Dispatch<UserDispatchTypes>) => {
		const token = localStorage.getItem('token');
		if (!token) return;
		const userResponse = await getCurrentUser();
		if (userResponse?.data) {
			console.log('userResponse?.data', userResponse?.data);
			dispatch({
				type: FETCH_CURRENT_USER,
				payload: userResponse.data,
			});
		}
	};

export const signin =
	(username: string, password: string) =>
	async (dispatch: Dispatch<UserDispatchTypes>) => {
		try {
			const response = await http.post(api.AUTH_TOKEN, {
				username,
				password,
			});
			const token = response.data.token;
			localStorage.setItem('token', token);
			dispatch({
				type: SIGN_IN,
				payload: {
					token,
				},
			});
			const userResponse = await getCurrentUser();
			if (userResponse?.data) {
				dispatch({
					type: FETCH_CURRENT_USER,
					payload: { ...userResponse.data },
				});
				history.push('/');
			}
		} catch ({ response: { data } }) {
			dispatch({
				type: AUTH_ERROR,
				payload: {
					error: data['error'],
					fieldError: data['field-error'],
				},
			});
		}
	};
export const signup =
	(username: string, name: string, surname: string, password: string) =>
	async (dispatch: Dispatch<any>) => {
		try {
			const response = await http.post(api.USERS, {
				username,
				first_name: name,
				last_name: surname,
				password,
			});
			dispatch(
				enqueueSnackbar({
					text: `User ${response.data.username} has been created successfully`,
					...successSnackbarConfig,
				})
			);
			history.push('/signin');
		} catch ({ response: { data } }) {
			dispatch({
				type: AUTH_ERROR,
				payload: {
					error: data['error'],
					fieldError: data['field-error'],
				},
			});
		}
	};

export const fetchCurrentUser =
	() => async (dispatch: Dispatch<UserDispatchTypes>) => {
		try {
			const userResponse = await getCurrentUser();
			if (userResponse?.data) {
				dispatch({
					type: FETCH_CURRENT_USER,
					payload: { ...userResponse.data },
				});
			}
		} catch ({ response: { data } }) {
			dispatch({
				type: USER_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const fetchAllUsers =
	() => async (dispatch: Dispatch<UserDispatchTypes>) => {
		try {
			const response = await http.get<Profile[]>('/profiles');
			if (response?.data) {
				dispatch({
					type: FETCH_ALL_USERS,
					payload: response.data,
				});
			}
		} catch ({ response: { data } }) {
			dispatch({
				type: USER_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const editUser =
	(data: FormData): ThunkActionWithPromise<string> =>
	async (dispatch, getState) => {
		const user_id = getState().userState.currentUser?.id;
		try {
			const response = await http.patch<Profile>(
				`${api.USERS}${user_id}/`,
				data
			);
			dispatch({ type: EDIT_USER, payload: response?.data });
			return Promise.resolve("Profile've been updated successfully");
		} catch ({ response: { data } }) {
			dispatch({
				type: USER_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
			return Promise.reject(data.error);
		}
	};

export const openUserFollowingModal =
	(val: boolean): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: FOLLOWING_MODAL_OPENED,
			payload: val,
		});
	};

export const fetchUserFollowing =
	(userId: number, isCurrentUser = false): ThunkActionWithPromise<void> =>
	async dispatch => {
		try {
			const response = await http.get<ProfileBrief[]>(
				`${api.USERS}following/${userId}`
			);
			//add check for isCurrentUser and change dispatch type for current or some another selected user
			dispatch({
				type: FETCH_FOLLOWING,
				payload: response.data,
			});
			return Promise.resolve();
		} catch ({ response: { data } }) {
			dispatch({
				type: USER_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
			return Promise.reject(data.error);
		}
	};

export const fetchUserFollowers =
	(userId: number, isCurrentUser = false): ThunkActionWithPromise<void> =>
	async dispatch => {
		try {
			const response = await http.get<ProfileBrief[]>(
				`${api.USERS}followers/${userId}`
			);
			//add check for isCurrentUser and change dispatch type for current or some another selected user
			dispatch({
				type: FETCH_FOLLOWING,
				payload: response.data,
			});
			return Promise.resolve();
		} catch ({ response: { data } }) {
			dispatch({
				type: USER_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
			return Promise.reject(data.error);
		}
	};

const getCurrentUser = async () => {
	const response = await http.get<Profile>(api.AUTH_ME);
	return response;
};
