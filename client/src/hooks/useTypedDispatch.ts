import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { AppDispatch, RootStore } from '../store';

// export type ThunkAppDispatch = ThunkDispatch<RootStore, void, ThunkAction>;
export type ThunkAppDispatch = ThunkDispatch<RootStore, any, Action>;

// export const useTypedDispatch = () => useDispatch<AppDispatch>();
export const useTypedDispatch = () => useDispatch<ThunkAppDispatch>();
