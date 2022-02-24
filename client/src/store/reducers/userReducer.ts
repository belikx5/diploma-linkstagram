import {
	UserDispatchTypes,
	Profile,
	CLEAR_DATA,
	SIGN_IN,
	FETCH_CURRENT_USER,
	SIGN_UP,
	EDIT_USER,
	FETCH_ALL_USERS,
	ApiAuthError,
	AUTH_ERROR,
	CLEAR_AUTH_ERROR,
	USER_ACTION_ERROR,
	CLEAR_USER_ACTION_ERROR,
	FOLLOWING_MODAL_OPENED,
	ProfileBrief,
	FETCH_FOLLOWING,
	FETCH_FOLLOWERS,
} from '../actionTypes/userActionTypes';

interface IDefaultState {
	currentUser: Profile | null;
	token: string;
	users: Profile[];
	authError: ApiAuthError;
	actionError: string;
	followingModalOpened: boolean;
	followers: ProfileBrief[];
	following: ProfileBrief[];
}

const initialState: IDefaultState = {
	currentUser: null,
	token: '',
	users: [],
	authError: {
		error: '',
		fieldError: [],
	},
	actionError: '',
	followingModalOpened: false,
	followers: [],
	following: [],
};

const reducer = (
	state = initialState,
	action: UserDispatchTypes
): IDefaultState => {
	switch (action.type) {
		case SIGN_IN:
			return {
				...state,
				token: action.payload.token,
				authError: initialState.authError,
			};
		case SIGN_UP:
			return {
				...state,
				token: action.payload.token,
				authError: initialState.authError,
			};
		case AUTH_ERROR:
			return { ...state, authError: action.payload };
		case FETCH_CURRENT_USER:
			return { ...state, currentUser: action.payload, actionError: '' };
		case EDIT_USER:
			return {
				...state,
				currentUser: action.payload,
				users: state.users.map(u =>
					u.username === state.currentUser?.username ? action.payload : u
				),
				actionError: '',
			};
		case FETCH_ALL_USERS:
			return { ...state, users: action.payload, actionError: '' };
		case FOLLOWING_MODAL_OPENED:
			return { ...state, followingModalOpened: action.payload };
		case FETCH_FOLLOWING:
			return { ...state, following: action.payload };
		case FETCH_FOLLOWERS:
			return { ...state, followers: action.payload };
		case CLEAR_AUTH_ERROR:
			return { ...state, authError: initialState.authError };
		case CLEAR_DATA:
			return { ...state, currentUser: null, actionError: '' };
		case USER_ACTION_ERROR:
			return { ...state, actionError: action.payload.error };
		case CLEAR_USER_ACTION_ERROR:
			return { ...state, actionError: '' };
		default:
			return state;
	}
};
export default reducer;
