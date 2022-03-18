import { ThunkActionVoid, ThunkActionWithPromise } from '..';
import api from '../../services/api';
import http from '../../services/http';
import {
	Chat,
	ChatBrief,
	CHAT_ACTION_ERROR,
	FETCH_CHAT,
	FETCH_CHATS,
	FETCH_CHATS_LOADING,
	FETCH_CHAT_MESSAGES,
	FETCH_CHAT_MESSAGES_LOADING,
	Message,
	RESET_CHAT_MESSAGES,
	SELECT_CHAT,
} from '../actionTypes/chatActionsTypes';

export const selectChat =
	(chatData: ChatBrief | null): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: SELECT_CHAT,
			payload: chatData,
		});
	};

export const fetchChat =
	(chatId: number): ThunkActionWithPromise<void> =>
	async dispatch => {
		try {
			const response = await http.get<Chat>(`${api.CHATS}${chatId}/`);
			dispatch({
				type: FETCH_CHAT,
				payload: response.data,
			});
		} finally {
			//do smthing
		}
	};

export const fetchChats = (): ThunkActionVoid => async (dispatch, getState) => {
	dispatch({
		type: FETCH_CHATS_LOADING,
		payload: true,
	});
	try {
		const user = getState().userState.currentUser;
		const response = await http.get<ChatBrief[]>(
			`${api.CHATS}?user__id=${user?.id}`
		);
		const chats = response.data;
		dispatch({
			type: FETCH_CHATS,
			payload: chats,
		});
		chats.length > 0 &&
			dispatch({
				type: SELECT_CHAT,
				payload: chats[0],
			});
	} finally {
		dispatch({
			type: FETCH_CHATS_LOADING,
			payload: false,
		});
	}
};

export const fetchChatMessages =
	(chatId: number): ThunkActionVoid =>
	async dispatch => {
		dispatch({
			type: FETCH_CHAT_MESSAGES_LOADING,
			payload: true,
		});
		try {
			const response = await http.get<Message[]>(
				`${api.MESSAGES}?chat__id=${chatId}`
			);
			dispatch({
				type: FETCH_CHAT_MESSAGES,
				payload: response.data,
			});
		} finally {
			dispatch({
				type: FETCH_CHAT_MESSAGES_LOADING,
				payload: false,
			});
		}
	};

export const resetChatMessages = (): ThunkActionVoid => dispatch => {
	dispatch({
		type: RESET_CHAT_MESSAGES,
		payload: [],
	});
};
