import axios, { AxiosRequestConfig } from 'axios';
import store from '../store';
import {
	enqueueSnackbar,
	errorSnackbarConfig,
} from '../store/actions/uiActions';

const http = axios.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

http.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		let token = localStorage.getItem('token');
		if (token && !config.url?.includes('token')) {
			config.headers['Authorization'] = `Token ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

const errorHandler = async (error: {
	response: { data: string | any[]; status: number; config: { url: string } };
}) => {
	if (error.response && error.response.data) {
		//if token rejected => check if current session still active or do logout
		//don't show any error messages
		if (
			error.response.status === 401 &&
			!error.response.config.url.endsWith('token/')
		) {
			// isUserSessionActive(isActive => {
			//   if (!isActive) logout();
			// })
			return Promise.reject(error);
		}

		//handle and show message with error
		if (typeof error.response.data == 'object') {
			Object.keys(error.response.data).forEach((key: any) => {
				let errorValue = error.response.data[key];
				key = key === 'detail' ? 'Error' : key;
				if (Array.isArray(errorValue)) {
					if (errorValue[0] === 'Unable to log in with provided credentials.') {
						store.dispatch<any>(
							enqueueSnackbar({
								text: 'Unable to log in with provided credentials.',
								...errorSnackbarConfig,
							})
						);
						return;
					}
					errorValue =
						typeof errorValue[0] === 'object'
							? errorValue[0].message
							: errorValue[0];
					store.dispatch<any>(
						enqueueSnackbar({
							text: `${key}: ${errorValue}`,
							...errorSnackbarConfig,
						})
					);
					// Vue.$toast.error(`${key}: ${errorValue}`);
				} else {
					store.dispatch<any>(
						enqueueSnackbar({
							text: `${key}: ${errorValue}`,
							...errorSnackbarConfig,
						})
					);
				}
			});
		} else if (typeof error.response.data == 'string') {
			if (error.response.data.length > 300) {
				store.dispatch<any>(
					enqueueSnackbar({
						text: 'Server error. Please check the logs',
						...errorSnackbarConfig,
					})
				);
			} else {
				store.dispatch<any>(
					enqueueSnackbar({
						text: error.response.data,
						...errorSnackbarConfig,
					})
				);
			}
		}
	}
	return Promise.reject(error);
};

http.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		return errorHandler(error);
	}
);

export default http;
