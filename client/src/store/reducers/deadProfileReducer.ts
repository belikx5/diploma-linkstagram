import { DeadProfile, deadProfileDispatchTypes, FETCH_DEAD_PROFILE, FETCH_DEAD_PROFILE_LOADING } from "../actionTypes/deadProfileActionTypes";

interface IDefaultState {
    deadProfile: DeadProfile | null,
    deadProfileLoading: boolean;
}

const initialState: IDefaultState = {
    deadProfile: null,
    deadProfileLoading: false
}

const reducer = (state = initialState, action: deadProfileDispatchTypes): IDefaultState  => {
    switch(action.type) {
        case FETCH_DEAD_PROFILE:
            return {...state, deadProfile: action.payload };
        case FETCH_DEAD_PROFILE_LOADING:
            return {...state, deadProfileLoading: action.payload};
        default:
            return state;
    }
}

export default reducer;