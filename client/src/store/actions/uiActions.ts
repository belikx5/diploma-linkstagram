import { Dispatch } from 'redux';
import {
	Notification,
	SnackbarVariant,
	UIDispatchTypes,
	CLOSE_SNACKBAR,
	ENQUEUE_SNACKBAR,
	REMOVE_SNACKBAR,
} from '../actionTypes/uiActionTypes';

export const enqueueSnackbar =
	(notification: Notification) =>
	(dispatch: Dispatch<UIDispatchTypes | any>) => {
		const key = Date.now().toString();
		dispatch({
			type: ENQUEUE_SNACKBAR,
			payload: {
				...notification,
				key,
				options: {
					...notification.options,
					onClose: () => dispatch(closeSnackbar(key)),
				},
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

const _getSnackbarConfig = (value: string) => {
	return {
		options: {
			variant: value,
		},
	};
};

export const successSnackbarConfig = _getSnackbarConfig(
	SnackbarVariant.SUCCESS
);

export const errorSnackbarConfig = _getSnackbarConfig(SnackbarVariant.ERROR);

export const infoSnackbarConfig = _getSnackbarConfig(SnackbarVariant.INFO);

export const warningSnackbarConfig = _getSnackbarConfig(
	SnackbarVariant.WARNING
);
