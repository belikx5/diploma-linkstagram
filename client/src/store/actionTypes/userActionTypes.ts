export const CLEAR_DATA = "CLEAR_DATA";
export const SIGN_IN = "SIGN_IN";
export const SIGN_UP = "SIGN_UP";
export const AUTH_ERROR = "AUTH_ERROR";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";

export const FETCH_ALL_USERS = "FETCH_ALL_USERS";
export const FETCH_CURRENT_USER = "FETCH_CURRENT_USER";
export const FETCH_ANOTHER_USER = "FETCH_ANOTHER_USER";
export const EDIT_USER = "EDIT_USER";

export const FETCH_RECOMMENDATIONS = "FETCH_RECOMMENDATIONS";
export const FETCH_RECOMMENDATIONS_LOADING = "FETCH_RECOMMENDATIONS_LOADING";

export const USER_ACTION_ERROR = "USER_ACTION_ERROR";
export const CLEAR_USER_ACTION_ERROR = "CLEAR_USER_ACTION_ERROR";

export const FOLLOWING_MODAL_OPENED = "FOLLOWING_MODAL_OPENED";
export const FETCH_FOLLOWERS = "FETCH_FOLLOWERS";
export const FETCH_FOLLOWING = "FETCH_FOLLOWING";
export const FOLLOW = "FOLLOW";
export const UNFOLLOW = "UNFOLLOW";

export type ProfileBrief = {
  id: number;
  profile_photo: string;
  username: string;
  first_name: string;
  last_name: string;
  tags: string[];
};

export type Follower = {
  id: number;
  created_at: string;
  user: ProfileBrief;
};

export type Profile = {
  id: number;
  username: string;
  bio: string;
  first_name: string;
  followers_count: number;
  following_count: number;
  last_name: string;
  profile_photo: string;
  is_dead_profile: boolean;
  is_group_of_interest: boolean;
  tags: string[];
  followers: Follower[];
  following: Follower[];
  is_following: boolean;
  is_follower: boolean;
};

export type AnotherUserProfile = Profile & {
  followers: ProfileBrief[];
  following: ProfileBrief[];
};

export type UserFollowingResponse = {
  following_user: ProfileBrief;
  user: ProfileBrief;
};

export type ProfileToEdit = {
  description?: string;
  first_name?: string;
  last_name?: string;
  profile_photo?: any;
};

export type Account = {
  username: string;
  email: string;
  password: string;
};

export type ApiAuthError = {
  fieldError: string[];
  error: string;
};

export interface ClearData {
  type: typeof CLEAR_DATA;
}

export interface AuthError {
  type: typeof AUTH_ERROR;
  payload: ApiAuthError;
}
export interface ClearAuthError {
  type: typeof CLEAR_AUTH_ERROR;
}
export interface SignIn {
  type: typeof SIGN_IN;
  payload: {
    token: string;
  };
}

export interface SignUp {
  type: typeof SIGN_UP;
  payload: {
    token: string;
  };
}

export interface EditUser {
  type: typeof EDIT_USER;
  payload: Profile;
}

export interface FetchCurrentUser {
  type: typeof FETCH_CURRENT_USER;
  payload: Profile | null;
}

export interface FetchAnotherUser {
  type: typeof FETCH_ANOTHER_USER;
  payload: AnotherUserProfile | null;
}

export interface FetchRecommendations {
  type: typeof FETCH_RECOMMENDATIONS;
  payload: ProfileBrief[];
}

export interface FetchRecommendationsLoading {
  type: typeof FETCH_RECOMMENDATIONS_LOADING;
  payload: boolean;
}

export interface UserActionError {
  type: typeof USER_ACTION_ERROR;
  payload: {
    error: string;
  };
}

export interface ClearUserActionError {
  type: typeof CLEAR_USER_ACTION_ERROR;
}

export interface UserFollowingModalOpened {
  type: typeof FOLLOWING_MODAL_OPENED;
  payload: {
    isFollowersModal: boolean;
    value: boolean;
  };
}

export interface FetchUserFollowers {
  type: typeof FETCH_FOLLOWERS;
  payload: ProfileBrief[];
}

export interface FetchUserFollowing {
  type: typeof FETCH_FOLLOWING;
  payload: ProfileBrief[];
}

export interface Follow {
  type: typeof FOLLOW;
  payload: {
    user: ProfileBrief;
    following_user: ProfileBrief;
  };
}

export interface Unfollow {
  type: typeof UNFOLLOW;
  payload: {
    userId: number;
    userToFollowId: number;
  };
}

export type UserDispatchTypes =
  | ClearData
  | SignIn
  | SignUp
  | AuthError
  | ClearAuthError
  | FetchRecommendations
  | FetchRecommendationsLoading
  | FetchCurrentUser
  | FetchAnotherUser
  | EditUser
  | UserActionError
  | ClearUserActionError
  | UserFollowingModalOpened
  | FetchUserFollowers
  | FetchUserFollowing
  | Follow
  | Unfollow;
