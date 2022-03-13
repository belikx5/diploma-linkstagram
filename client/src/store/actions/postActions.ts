import { Dispatch } from 'redux';
import api from '../../services/api';
import http from '../../services/http';
import history from '../../services/history';
import {
	ADD_COMMENT,
	CLEAR_POST_ACTION_ERROR,
	Comment,
	CREATE_POST,
	CREATE_POST_MODAL_OPENED,
	DELETE_POST,
	EDIT_POST_DESCRIPTION,
	FETCH_ALL_POSTS,
	FETCH_POSTS_BY_USER,
	FETCH_POST_BY_ID,
	Post,
	PostDispatchTypes,
	POST_ACTION_ERROR,
	POST_DETAILS_MODAL_OPENED,
	REMOVE_LIKE,
	RESET_CURRENT_POST,
	SET_IS_POSTS_FETCHED,
	SET_LIKE,
} from '../actionTypes/postActionTypes';
import { ThunkActionVoid, ThunkActionWithPromise } from '..';

export const fetchAllPosts =
	() => async (dispatch: Dispatch<PostDispatchTypes>) => {
		try {
			const response = await http.get<Post[]>(api.POSTS);
			dispatch({ type: FETCH_ALL_POSTS, payload: response.data });
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const fetchPostById =
	(postId: number) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		try {
			const response = await http.get<Post>(`${api.POSTS}${postId}/`);
			dispatch({
				type: FETCH_POST_BY_ID,
				payload: {
					...response.data,
				},
			});
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const resetCurrentPost =
	() => (dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({
			type: RESET_CURRENT_POST,
			payload: null,
		});
	};

export const fetchPostByUser =
	(userId: number) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		try {
			const response = await http.get<Post[]>(
				`${api.POSTS}?ordering=-created_at&search=${userId}`
			);
			dispatch({ type: FETCH_POSTS_BY_USER, payload: response.data });
		} catch ({ response: { data } }) {
			console.log(data);
		}
	};
export const setIsPostsFetched =
	(value: boolean) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({ type: SET_IS_POSTS_FETCHED, payload: value });
	};
export const setPostActionError =
	(message: string) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({ type: POST_ACTION_ERROR, payload: { error: message } });
	};
export const createPost =
	(post: FormData): ThunkActionWithPromise<void> =>
	async (dispatch, getState) => {
		try {
			const response = await http.post<Post>(api.POSTS, post);
			const newPost = {
				...response.data,
				author: getState().userState.currentUser,
				comments: [],
			};
			dispatch({
				type: CREATE_POST,
				payload: newPost,
			});
			dispatch({ type: CREATE_POST_MODAL_OPENED, payload: false });
			return Promise.resolve();
		} catch (err) {
			// const { response: { data } } = err;
			// dispatch({
			// 	type: POST_ACTION_ERROR,
			// 	payload: {
			// 		error: data.error,
			// 	},
			// });
			return Promise.reject();
		}
	};

export const openCreatePostModal =
	(value: boolean) => (dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({ type: CREATE_POST_MODAL_OPENED, payload: value });
	};
export const openPostDetailsModal =
	(postId: number, value: boolean) =>
	(dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({
			type: POST_DETAILS_MODAL_OPENED,
			payload: {
				postId,
				value,
			},
		});
	};
export const editPostDescription =
	(postId: number, value: string): ThunkActionWithPromise<void> =>
	async dispatch => {
		try {
			await http.patch(`${api.POSTS}${postId}/`, {
				description: value,
			});
			dispatch({
				type: EDIT_POST_DESCRIPTION,
				payload: {
					postId,
					newDescription: value,
				},
			});
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const deletePost =
	(postId: number) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		try {
			await http.delete(`${api.POSTS}${postId}/`);
			dispatch({ type: DELETE_POST, payload: { postId } });
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const setLike =
	(postId: number): ThunkActionVoid =>
	async (dispatch, getState) => {
		const author = getState().userState.currentUser;
		try {
			await http.post(api.LIKES, {
				post: postId,
				user: author?.id,
			});
			dispatch({
				type: SET_LIKE,
				payload: {
					postId,
				},
			});
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const removeLike =
	(post: Post): ThunkActionVoid =>
	async (dispatch, getState) => {
		const author = getState().userState.currentUser;
		try {
			await http.delete(`${api.LIKES_DELETE}${post.id}/${author?.id}/`);
			dispatch({
				type: REMOVE_LIKE,
				payload: {
					postId: post.id,
				},
			});
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const fetchComments =
	(postId: number) => async (dispatch: Dispatch<PostDispatchTypes>) => {
		try {
			// const response = await http.get<Comment[]>(`/posts/${postId}/comments`);
			// dispatch({
			// 	type: FETCH_COMMENTS,
			// 	payload: {
			// 		comments: response.data,
			// 		postId: postId,
			// 	},
			// });
		} catch ({ response: { data } }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: data.error,
				},
			});
		}
	};

export const addComment =
	(postId: number, message: string): ThunkActionVoid =>
	async (dispatch, getState) => {
		const currentUser = getState().userState.currentUser;
		try {
			const response = await http.post<Comment>(api.COMMENTS, {
				message,
				user: currentUser?.id,
				post: postId,
			});
			dispatch({
				type: ADD_COMMENT,
				payload: {
					postId,
					comment: {
						...response.data,
						user: currentUser,
					},
				},
			});
		} catch ({ response }) {
			dispatch({
				type: POST_ACTION_ERROR,
				payload: {
					error: response.data?.error,
				},
			});
		}
	};

export const ClearPostActionError =
	() => (dispatch: Dispatch<PostDispatchTypes>) => {
		dispatch({ type: CLEAR_POST_ACTION_ERROR });
	};
