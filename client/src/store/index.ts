// import { createStore, applyMiddleware } from 'redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const composeEnhancers =
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk))
);

export type RootStore = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
