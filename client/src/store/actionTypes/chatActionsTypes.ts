import { ProfileBrief } from './userActionTypes';

export const SELECT_CHAT = 'SELECT_CHAT';
export const FETCH_CHAT = 'FETCH_CHAT';
export const FETCH_CHAT_MESSAGES = 'FETCH_CHAT_MESSAGES';
export const RESET_CHAT_MESSAGES = 'RESET_CHAT_MESSAGES';
export const FETCH_CHAT_MESSAGES_LOADING = 'FETCH_CHAT_MESSAGES_LOADING';

export const FETCH_CHATS = 'FETCH_CHATS';
export const FETCH_CHATS_LOADING = 'FETCH_CHATS_LOADING';

export const CHAT_ACTION_ERROR = 'CHAT_ACTION_ERROR';
export const CLEAR_CHAT_ACTION_ERROR = 'CLEAR_CHAT_ACTION_ERROR';

export type ChatBrief = {
	id: number;
	companion: ProfileBrief;
	participants: ProfileBrief[];
};

export type Chat = ChatBrief & {
	messages: Message[];
};

export type Message = {
	id: number;
	sender: ProfileBrief;
	content: string;
	created_at: string;
};

export interface SelectChat {
	type: typeof SELECT_CHAT;
	payload: ChatBrief;
}

export interface FetchChat {
	type: typeof FETCH_CHAT;
	payload: Chat;
}
export interface FetchChatMessages {
	type: typeof FETCH_CHAT_MESSAGES;
	payload: Message[];
}
export interface ResetChatMessages {
	type: typeof RESET_CHAT_MESSAGES;
	payload: Message[];
}
export interface FetchChatMessagesLoading {
	type: typeof FETCH_CHAT_MESSAGES_LOADING;
	payload: boolean;
}

export interface FetchChats {
	type: typeof FETCH_CHATS;
	payload: ChatBrief[];
}

export interface FetchChatsLoading {
	type: typeof FETCH_CHATS_LOADING;
	payload: boolean;
}

export interface ChatActionError {
	type: typeof CHAT_ACTION_ERROR;
	payload: {
		error: string;
	};
}

export interface ClearChatActionError {
	type: typeof CLEAR_CHAT_ACTION_ERROR;
}

export type ChatDispatchTypes =
	| SelectChat
	| FetchChats
	| FetchChat
	| FetchChatMessages
	| ResetChatMessages
	| FetchChatMessagesLoading
	| FetchChatsLoading
	| ChatActionError
	| ClearChatActionError;
