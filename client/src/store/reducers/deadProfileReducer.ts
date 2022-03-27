import {
  CREATE_DEAD_PROFILE,
  DeadProfile,
  deadProfileDispatchTypes,
  DELETE_DEAD_PROFILE,
  FETCH_DEAD_PROFILE,
  FETCH_DEAD_PROFILE_LOADING,
  UPDATE_DEAD_PROFILE,
} from "../actionTypes/deadProfileActionTypes";

interface IDefaultState {
  deadProfile: DeadProfile | null;
  deadProfileLoading: boolean;
}

const initialState: IDefaultState = {
  deadProfile: null,
  deadProfileLoading: false,
};

const reducer = (
  state = initialState,
  action: deadProfileDispatchTypes
): IDefaultState => {
  switch (action.type) {
    case FETCH_DEAD_PROFILE:
      return { ...state, deadProfile: action.payload };
    case FETCH_DEAD_PROFILE_LOADING:
      return { ...state, deadProfileLoading: action.payload };
    case CREATE_DEAD_PROFILE:
      return { ...state, deadProfile: action.payload };
    case UPDATE_DEAD_PROFILE:
      return { ...state, deadProfile: action.payload };
    case DELETE_DEAD_PROFILE:
      return { ...state, deadProfile: null };
    default:
      return state;
  }
};

export default reducer;
