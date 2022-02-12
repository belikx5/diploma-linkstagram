import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AlertMessage from './ui/ErrorAlert';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { ClearPostActionError } from '../store/actions/postActions';
import { clearUserActionError } from '../store/actions/userActions';
import { SnackbarProvider, useSnackbar } from 'notistack';
import useNotifier from '../hooks/useNotifier';
import {
	closeSnackbar as closeSnackbarAction,
	enqueueSnackbar as enqueueSnackbarAction,
} from '../store/actions/uiActions';
import { Notification } from '../store/actionTypes/uiActionTypes';

type AppWrapperProps = {
	children: JSX.Element;
};

function AppWrapper({ children }: AppWrapperProps) {
	useNotifier();
	const dispatch = useDispatch();
	const enqueueSnackbar = (notif: Notification) =>
		dispatch(enqueueSnackbarAction(notif));
	const closeSnackbar = (key?: string) => dispatch(closeSnackbarAction(key));

	const postActionError = useTypedSelector(
		state => state.postsState.actionError
	);
	const userActionError = useTypedSelector(
		state => state.userState.actionError
	);
	const notifications = useTypedSelector(state => state.uiState.notifications);

	const [successMessageShown, setSuccessMessageShown] = useState(false);
	const [postError, setPostError] = useState(false);
	const [userError, setUserError] = useState(false);

	const setSuccessMessageOpen = (val: boolean) => {
		setSuccessMessageShown(val);
		// dispatch(clearAlertQue());
	};
	const setPostAlertOpen = (val: boolean) => {
		setPostError(val);
		dispatch(ClearPostActionError());
	};
	const setUserAlertOpen = (val: boolean) => {
		setUserError(val);
		dispatch(clearUserActionError());
	};

	useEffect(() => {
		setPostError(!!postActionError);
		enqueueSnackbar({
			key: '',
			text: postActionError,
			options: {
				variant: 'error',
			},
		});
	}, [postActionError]);
	useEffect(() => {
		setUserError(!!userActionError);
		enqueueSnackbar({
			key: '',
			text: userActionError,
			options: {
				variant: 'error',
			},
		});
	}, [userActionError]);

	return (
		<>
			{/* {successMessageShown && (
				<AlertMessage
					message={alertMessages}
					type='error'
					isAlertOpen={successMessageShown}
					setAlertOpen={setSuccessMessageOpen}
					autoHideTime={20000}
				/>
			)}
			{userError && (
				<AlertMessage
					message={userActionError}
					type='error'
					isAlertOpen={userError}
					setAlertOpen={setUserAlertOpen}
					autoHideTime={20000}
				/>
			)}
			{postError && (
				<AlertMessage
					message={postActionError}
					type='error'
					isAlertOpen={postError}
					setAlertOpen={setPostAlertOpen}
					autoHideTime={20000}
				/>
			)} */}
			<SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
		</>
	);
}

export default AppWrapper;
