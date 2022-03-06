import { Post } from '../actionTypes/postActionTypes';
import {
	FETCH_SEARCHED_POSTS,
	FETCH_SEARCHED_PROFILES,
	SearchDispatchTypes,
	SEARCH_TYPES,
	SET_SEARCH_TYPE,
	SET_SEARCH_VALUE,
} from '../actionTypes/searchActionTypes';
import { ProfileBrief } from '../actionTypes/userActionTypes';

interface IDefaultState {
	searchValue: string;
	searchType: string;
	searchedProfiles: ProfileBrief[];
	searchedPosts: Post[];
}

const initialState: IDefaultState = {
	searchValue: '',
	searchType: SEARCH_TYPES.PROFILES,
	searchedProfiles: [],
	searchedPosts: [],
};

const reducer = (
	state = initialState,
	action: SearchDispatchTypes
): IDefaultState => {
	switch (action.type) {
		case SET_SEARCH_VALUE:
			return { ...state, searchValue: action.payload };
		case SET_SEARCH_TYPE:
			return { ...state, searchType: action.payload };
		case FETCH_SEARCHED_PROFILES:
			return { ...state, searchedProfiles: action.payload };
		case FETCH_SEARCHED_POSTS:
			return { ...state, searchedPosts: action.payload };
		default:
			return state;
	}
};

export default reducer;
