export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export type Notification = {
	text: string;
	key: string;
	dismissed?: boolean;
	options?: any; // object with different proeprties
};

export interface CloseSnackbar {
	type: typeof CLOSE_SNACKBAR;
	payload: {
		dismissAll: boolean; // dismiss all if no key has been defined
		key?: string;
	};
}

export interface EnqueueSnackbar {
	type: typeof ENQUEUE_SNACKBAR;
	payload: Notification;
}

export interface RemoveSnackbar {
	type: typeof REMOVE_SNACKBAR;
	payload: {
		key: string;
	};
}

export type UIDispatchTypes = CloseSnackbar | EnqueueSnackbar | RemoveSnackbar;
