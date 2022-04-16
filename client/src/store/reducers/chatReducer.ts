import {
  Chat,
  ChatBrief,
  ChatDispatchTypes,
  Message,
  FETCH_CHAT,
  FETCH_CHATS,
  FETCH_CHATS_LOADING,
  FETCH_CHAT_MESSAGES,
  FETCH_CHAT_MESSAGES_LOADING,
  SELECT_CHAT,
  RESET_CHAT_MESSAGES,
  SEND_MESSAGE,
  START_FETCH_MSG_JOB,
  STOP_FETCH_MSG_JOB,
  SET_CHAT_WEB_SOCKET,
  RESET_CHAT_WEB_SOCKET,
} from "../actionTypes/chatActionsTypes";

interface IDefaultState {
  chats: ChatBrief[];
  selectedChat: ChatBrief | null;
  messages: Message[];
  currentChat: Chat | null;
  chatsLoading: boolean;
  chatMessagesLoading: boolean;
  fetchMessageJob: NodeJS.Timeout | null;
  chatWebSocket: WebSocket | null;
}

const initialState: IDefaultState = {
  chats: [],
  selectedChat: null,
  messages: [],
  currentChat: null,
  chatsLoading: false,
  chatMessagesLoading: false,
  fetchMessageJob: null,
  chatWebSocket: null,
};

const reducer = (
  state = initialState,
  action: ChatDispatchTypes
): IDefaultState => {
  switch (action.type) {
    case SELECT_CHAT:
      return { ...state, selectedChat: action.payload };
    case FETCH_CHAT:
      return { ...state, currentChat: action.payload };
    case FETCH_CHATS:
      return { ...state, chats: action.payload };
    case FETCH_CHATS_LOADING:
      return { ...state, chatsLoading: action.payload };
    case FETCH_CHAT_MESSAGES:
      return { ...state, messages: action.payload };
    case RESET_CHAT_MESSAGES:
      return { ...state, messages: action.payload };
    case FETCH_CHAT_MESSAGES_LOADING:
      return { ...state, chatMessagesLoading: action.payload };
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    case START_FETCH_MSG_JOB:
      return { ...state, fetchMessageJob: action.payload };
    case STOP_FETCH_MSG_JOB:
      return { ...state, fetchMessageJob: action.payload };
    case SET_CHAT_WEB_SOCKET:
      return { ...state, chatWebSocket: action.payload };
    case RESET_CHAT_WEB_SOCKET:
      return { ...state, chatWebSocket: action.payload };
    default:
      return state;
  }
};

export default reducer;
