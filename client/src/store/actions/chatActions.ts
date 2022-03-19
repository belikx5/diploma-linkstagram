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
	SEND_MESSAGE,
	START_FETCH_MSG_JOB,
	STOP_FETCH_MSG_JOB,
} from '../actionTypes/chatActionsTypes';

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

export const fetchChats =
	(preferredCompanionId?: number): ThunkActionVoid =>
	async (dispatch, getState) => {
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
			if (!preferredCompanionId) {
				//just fetch all chats
				dispatch({
					type: FETCH_CHATS,
					payload: chats,
				});
				chats.length > 0 &&
					dispatch({
						type: SELECT_CHAT,
						payload: chats[0],
					});
			} else {
				const companionIndex = chats.findIndex(
					chat => chat.companion.id === preferredCompanionId
				);
				if (companionIndex < 0) {
					const chatResponse = await http.post(api.CHATS, {
						participants: [user?.id, preferredCompanionId],
					});
					const userResponse = await http.get(
						`${api.USERS}${preferredCompanionId}/`
					);
					const newChats = [
						{
							...chatResponse.data,
							companion: userResponse.data,
						},
						...chats,
					];
					dispatch({
						type: FETCH_CHATS,
						payload: newChats,
					});
					dispatch({
						type: SELECT_CHAT,
						payload: newChats[0],
					});
				} else {
					dispatch({
						type: FETCH_CHATS,
						payload: chats,
					});
					chats.length > 0 &&
						dispatch({
							type: SELECT_CHAT,
							payload: chats[companionIndex],
						});
				}
			}
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

export const selectChat =
	(chatData: ChatBrief | null): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: SELECT_CHAT,
			payload: chatData,
		});
		chatData && dispatch(fetchChatMessages(chatData.id));
	};

export const sendMessage =
	(chatId: number, content: string): ThunkActionVoid =>
	async (dispatch, getState) => {
		try {
			const user = getState().userState.currentUser;
			const msgResponse = await http.post<Message>(api.MESSAGES, {
				sender: user?.id,
				chat: chatId,
				content,
			});
			dispatch({
				type: SEND_MESSAGE,
				payload: {
					chatId,
					message: {
						...msgResponse.data,
						sender: user,
					},
				},
			});
		} catch {
			dispatch({
				type: CHAT_ACTION_ERROR,
				payload: {
					error: 'An error occured while trying to send a message',
				},
			});
		}
	};

export const startFetchMsgJob =
	(handler: NodeJS.Timeout): ThunkActionVoid =>
	dispatch => {
		dispatch({
			type: START_FETCH_MSG_JOB,
			payload: handler,
		});
	};

export const stopFetchMsgJob = (): ThunkActionVoid => (dispatch, getState) => {
	const intervalHandler = getState().chatState.fetchMessageJob;
	intervalHandler && clearInterval(intervalHandler);
	dispatch({
		type: STOP_FETCH_MSG_JOB,
		payload: null,
	});
};

export const resetChatMessages = (): ThunkActionVoid => dispatch => {
	dispatch({
		type: RESET_CHAT_MESSAGES,
		payload: [],
	});
};
