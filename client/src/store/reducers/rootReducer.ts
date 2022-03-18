import { combineReducers } from 'redux';
import userReducer from './userReducer';
import postReducer from './postReducer';
import uiReducer from './uiReducer';
import searchReducer from './searchReducer';
import chatReducer from './chatReducer';

export default combineReducers({
	userState: userReducer,
	postsState: postReducer,
	uiState: uiReducer,
	searchState: searchReducer,
	chatState: chatReducer,
});
