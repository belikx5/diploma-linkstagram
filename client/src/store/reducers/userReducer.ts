import {
  UserDispatchTypes,
  Profile,
  CLEAR_DATA,
  SIGN_IN,
  FETCH_CURRENT_USER,
  SIGN_UP,
  EDIT_USER,
  ApiAuthError,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  USER_ACTION_ERROR,
  CLEAR_USER_ACTION_ERROR,
  FOLLOWING_MODAL_OPENED,
  ProfileBrief,
  FETCH_FOLLOWING,
  FETCH_FOLLOWERS,
  AnotherUserProfile,
  FETCH_ANOTHER_USER,
  FOLLOW,
  UNFOLLOW,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_LOADING,
} from "../actionTypes/userActionTypes";

interface IDefaultState {
  currentUser: Profile | null;
  anotherUserProfile: AnotherUserProfile | null;
  token: string;
  users: Profile[];
  authError: ApiAuthError;
  actionError: string;
  followingModalOpened: {
    isFollowersModal: boolean;
    value: boolean;
  };
  followers: ProfileBrief[];
  following: ProfileBrief[];
  recommendations: ProfileBrief[];
  recommendationsLoading: boolean;
}

const initialState: IDefaultState = {
  currentUser: null,
  anotherUserProfile: null,
  token: "",
  users: [],
  authError: {
    error: "",
    fieldError: [],
  },
  actionError: "",
  followingModalOpened: {
    isFollowersModal: false,
    value: false,
  },
  followers: [],
  following: [],
  recommendations: [],
  recommendationsLoading: false,
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
      return { ...state, currentUser: action.payload, actionError: "" };
    case FETCH_ANOTHER_USER:
      return { ...state, anotherUserProfile: action.payload };
    case FETCH_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload };
    case FETCH_RECOMMENDATIONS_LOADING:
      return { ...state, recommendationsLoading: action.payload };
    case EDIT_USER:
      return {
        ...state,
        currentUser: action.payload,
        users: state.users.map((u) =>
          u.username === state.currentUser?.username ? action.payload : u
        ),
        actionError: "",
      };
    case FOLLOWING_MODAL_OPENED:
      return { ...state, followingModalOpened: action.payload };
    case FETCH_FOLLOWING:
      return { ...state, following: action.payload };
    case FETCH_FOLLOWERS:
      return { ...state, followers: action.payload };
    // TODO: check if it's better to make 2 different arrays with followers and following for currUser and anotherUser
    // if so, then add logic for following array too
    case FOLLOW:
      return {
        ...state,
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              following_count: ++state.currentUser.following_count,
            }
          : null,
        anotherUserProfile: state.anotherUserProfile
          ? {
              ...state.anotherUserProfile,
              is_following: true,
              followers_count: ++state.anotherUserProfile.followers_count,
            }
          : null,
        followers: [...state.followers, action.payload.user],
      };
    case UNFOLLOW:
      return {
        ...state,
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              following_count: --state.currentUser.following_count,
            }
          : null,
        anotherUserProfile: state.anotherUserProfile
          ? {
              ...state.anotherUserProfile,
              is_following: false,
              followers_count: --state.anotherUserProfile.followers_count,
            }
          : null,
        followers: state.followers.filter(
          (f) => f.id !== action.payload.userId
        ),
      };
    case CLEAR_AUTH_ERROR:
      return { ...state, authError: initialState.authError };
    case CLEAR_DATA:
      return { ...state, currentUser: null, actionError: "" };
    case USER_ACTION_ERROR:
      return { ...state, actionError: action.payload.error };
    case CLEAR_USER_ACTION_ERROR:
      return { ...state, actionError: "" };
    default:
      return state;
  }
};
export default reducer;
