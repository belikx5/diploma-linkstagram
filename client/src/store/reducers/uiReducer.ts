import {
	Notification,
	EnqueueNotification,
	ENQUEUE_SNACKBAR,
	CLOSE_SNACKBAR,
	REMOVE_SNACKBAR,
	UIDispatchTypes,
} from '../actionTypes/uiActionTypes';

interface IDefaultState {
	notifications: EnqueueNotification[];
}

const initialState: IDefaultState = {
	notifications: [],
};

const reducer = (
	state = initialState,
	action: UIDispatchTypes
): IDefaultState => {
	switch (action.type) {
		case ENQUEUE_SNACKBAR:
			return {
				...state,
				notifications: [...state.notifications, action.payload],
			};

		case CLOSE_SNACKBAR:
			return {
				...state,
				notifications: state.notifications.map(notification =>
					action.payload.dismissAll || notification.key === action.payload.key
						? { ...notification, dismissed: true }
						: { ...notification }
				),
			};

		case REMOVE_SNACKBAR:
			return {
				...state,
				notifications: state.notifications.filter(
					notification => notification.key !== action.payload.key
				),
			};
		default:
			return state;
	}
};

export default reducer;
