import { ProfileBrief } from './userActionTypes';

export const SELECT_CHAT = 'SELECT_CHAT';
export const FETCH_CHAT = 'FETCH_CHAT';
export const FETCH_CHATS = 'FETCH_CHATS';

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
	payload: Chat[];
}

export interface FetchChats {
	type: typeof FETCH_CHATS;
	payload: ChatBrief[];
}

export type ChatDispatchTypes = SelectChat | FetchChats | FetchChat;
