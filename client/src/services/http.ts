import axios, { AxiosRequestConfig } from 'axios';

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

// const errorHandler = async error => {
//   if (error.response && error.response.data) {

//     //if token rejected => check if current session still active or do logout
//     //don't show any error messages
//     if (
//       error.response.status === 401 &&
//       !error.response.config.url.endsWith("token/")
//     ) {
//       isUserSessionActive(isActive => {
//         if (!isActive) logout();
//       })
//       return Promise.reject(error);
//     }

//     //handle and show message with error
//     if (typeof error.response.data == "object") {
//       Object.keys(error.response.data).forEach(key => {
//         let errorValue = error.response.data[key];
//         key = key === "detail" ? "Error" : key;
//         if (Array.isArray(errorValue)) {
//           if (errorValue[0] === "Unable to log in with provided credentials.") {
//             return;
//           }
//           errorValue =
//             typeof errorValue[0] === "object"
//               ? errorValue[0].message
//               : errorValue[0];
//           Vue.$toast.error(`${key}: ${errorValue}`);
//         } else {
//           Vue.$toast.error(`${key}: ${errorValue}`);
//         }
//       });
//     } else if (typeof error.response.data == "string") {
//       if (error.response.data.length > 300) {
//         Vue.$toast.error("Server error. Please check the logs");
//       } else {
//         Vue.$toast.error(error.response.data);
//       }
//     }
//   }
//   return Promise.reject(error);
// };

// http.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     return errorHandler(error);
//   }
// );

export default http;
