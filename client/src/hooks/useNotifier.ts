import React from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { removeSnackbar } from '../store/actions/uiActions';
import { useTypedSelector } from './useTypedSelector';

let displayed: string[] = [];

const useNotifier = () => {
	const dispatch = useDispatch();
	const notifications = useTypedSelector(state => state.uiState.notifications);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const storeDisplayed = (id: string) => {
		displayed = [...displayed, id];
	};

	const removeDisplayed = (id: string) => {
		displayed = [...displayed.filter(key => id !== key)];
	};

	React.useEffect(() => {
		notifications.forEach(({ key, text, options = {}, dismissed = false }) => {
			if (dismissed) {
				// dismiss snackbar using notistack
				closeSnackbar(key);
				return;
			}

			// do nothing if snackbar is already displayed
			if (displayed.includes(key)) return;

			// display snackbar using notistack
			enqueueSnackbar(text, {
				key,
				...options,
				onClose: (event, reason, myKey) => {
					if (options.onClose) {
						options.onClose(event, reason, myKey);
					}
				},
				onExited: (event, myKey: string) => {
					// remove this snackbar from redux store
					dispatch(removeSnackbar(myKey));
					removeDisplayed(myKey);
				},
			});

			// keep track of snackbars that we've displayed
			storeDisplayed(key);
		});
	}, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
