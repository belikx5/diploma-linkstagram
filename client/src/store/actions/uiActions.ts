import { Dispatch } from 'redux';
import {
	Notification,
	UIDispatchTypes,
	CLOSE_SNACKBAR,
	ENQUEUE_SNACKBAR,
	REMOVE_SNACKBAR,
} from '../actionTypes/uiActionTypes';

export const enqueueSnackbar =
	(notifgication: Notification) => (dispatch: Dispatch<UIDispatchTypes>) => {
		dispatch({
			type: ENQUEUE_SNACKBAR,
			payload: {
				...notifgication,
				key: Date.now().toString(),
			},
		});
	};

export const closeSnackbar =
	(key?: string) => (dispatch: Dispatch<UIDispatchTypes>) => {
		dispatch({
			type: CLOSE_SNACKBAR,
			payload: {
				dismissAll: !!key,
				key: key,
			},
		});
	};

export const removeSnackbar =
	(key: string) => (dispatch: Dispatch<UIDispatchTypes>) => {
		dispatch({
			type: REMOVE_SNACKBAR,
			payload: {
				key,
			},
		});
	};
