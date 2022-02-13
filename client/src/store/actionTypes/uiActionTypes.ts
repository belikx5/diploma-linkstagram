export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export interface Notification {
	text: string;
	dismissed?: boolean;
	options?: any; // object with different proeprties
}

export interface EnqueueNotification extends Notification {
	key: string;
}

export enum SnackbarVariant {
	SUCCESS = 'sucess',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
}
export interface CloseSnackbar {
	type: typeof CLOSE_SNACKBAR;
	payload: {
		dismissAll: boolean; // dismiss all if no key has been defined
		key?: string;
	};
}

export interface EnqueueSnackbar {
	type: typeof ENQUEUE_SNACKBAR;
	payload: EnqueueNotification;
}

export interface RemoveSnackbar {
	type: typeof REMOVE_SNACKBAR;
	payload: {
		key: string;
	};
}

export type UIDispatchTypes = CloseSnackbar | EnqueueSnackbar | RemoveSnackbar;
