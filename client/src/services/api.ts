const SERVER_URL = 'http://127.0.0.1:8000';

const api = {
	AUTH_TOKEN: `${SERVER_URL}/api/token-auth/`,
	AUTH_ME: `${SERVER_URL}/users/me/`,
	USERS: `${SERVER_URL}/api/users/`,
	USER_FOLLOWING: `${SERVER_URL}/api/user-following/`,
	FOLLOWING_DELETE: `${SERVER_URL}/api/users/following-delete/`,
	FOLLOWING: `${SERVER_URL}/api/users/following/`,
	FOLLOWERS: `${SERVER_URL}/api/users/followers/`,
	POSTS: `${SERVER_URL}/api/posts/`,
	COMMENTS: `${SERVER_URL}/api/comments/`,
	LIKES: `${SERVER_URL}/api/likes/`,
	LIKES_DELETE: `${SERVER_URL}/api/likes-delete/`,
	CHATS: `${SERVER_URL}/api/chats/`,
	MESSAGES: `${SERVER_URL}/api/messages/`,
};

export default api;
