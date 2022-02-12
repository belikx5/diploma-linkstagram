import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}

type AlertMessageProps = {
	message: string;
	type: 'error' | 'success';
	isAlertOpen: boolean;
	setAlertOpen: (val: boolean) => void;
	autoHideTime: number;
};

function AlertMessage({
	message,
	type,
	isAlertOpen,
	setAlertOpen,
	autoHideTime = 6000,
}: AlertMessageProps) {
	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setAlertOpen(false);
	};
	return <></>;
	// Array.isArray(message) ? (
	// 	<>
	// 		{message.map(msg => (
	// 			<Snackbar
	// 				open={isAlertOpen}
	// 				autoHideDuration={autoHideTime}
	// 				onClose={handleClose}
	// 				className='error-alert-message'>
	// 				<Alert onClose={handleClose} severity={type}>
	// 					{msg.text}
	// 				</Alert>
	// 			</Snackbar>
	// 		))}
	// 	</>
	// ) : (
	// 	<Snackbar
	// 		open={isAlertOpen}
	// 		autoHideDuration={autoHideTime}
	// 		onClose={handleClose}
	// 		className='error-alert-message'>
	// 		<Alert onClose={handleClose} severity={type}>
	// 			{message}
	// 		</Alert>
	// 	</Snackbar>
	// );
}

export default AlertMessage;
