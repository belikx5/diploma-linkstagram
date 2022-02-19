// import axios from 'axios';
// export default axios.create({
// 	// baseURL: "https://linkstagram-api.ga",
// 	baseURL: 'http://127.0.0.1:8000/api',
// 	headers: {
// 		Accept: 'application/json',
// 		'Content-Type': 'application/json',
// 	},
// });

const SERVER_URL = 'http://127.0.0.1:8000';

const api = {
	AUTH_TOKEN: `${SERVER_URL}/api/token-auth/`,
	AUTH_ME: `${SERVER_URL}/users/me/`,
	USERS: `${SERVER_URL}/api/users/`,
	POSTS: `${SERVER_URL}/api/posts/`,
	COMMENTS: `${SERVER_URL}/api/comments/`,
	LIKES: `${SERVER_URL}/api/likes/`,
	LIKES_DELETE: `${SERVER_URL}/api/likes-delete/`,
};

export default api;
