import { Post } from './postActionTypes';
import { ProfileBrief } from './userActionTypes';

export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE';
export const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE';
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING';
export const FETCH_SEARCHED_PROFILES = 'FETCH_SEARCHED_PROFILES';
export const FETCH_SEARCHED_POSTS = 'FETCH_SEARCHED_POSTS';

export enum SEARCH_TYPES {
	PROFILES = 'profiles',
	POSTS = 'posts',
}

export interface SetSearchValue {
	type: typeof SET_SEARCH_VALUE;
	payload: string;
}

export interface SetSearchType {
	type: typeof SET_SEARCH_TYPE;
	payload: string;
}

export interface SetSearchLoading {
	type: typeof SET_SEARCH_LOADING;
	payload: boolean;
}

export interface FetchSearchedProfiles {
	type: typeof FETCH_SEARCHED_PROFILES;
	payload: ProfileBrief[];
}

export interface FetchSearchedPosts {
	type: typeof FETCH_SEARCHED_POSTS;
	payload: Post[];
}

export type SearchDispatchTypes =
	| SetSearchValue
	| SetSearchType
	| SetSearchLoading
	| FetchSearchedProfiles
	| FetchSearchedPosts;
