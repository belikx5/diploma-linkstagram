import { combineReducers } from 'redux';
import userReducer from './userReducer';
import postReducer from './postReducer';
import uiReducer from './uiReducer';

export default combineReducers({
	userState: userReducer,
	postsState: postReducer,
	uiState: uiReducer,
});
