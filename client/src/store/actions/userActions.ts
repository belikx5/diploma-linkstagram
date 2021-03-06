import { Dispatch } from "redux";
import api from "../../services/api";
import http from "../../services/http";
import history from "../../services/history";
import {
  CLEAR_DATA,
  AUTH_ERROR,
  SIGN_IN,
  UserDispatchTypes,
  FETCH_CURRENT_USER,
  FETCH_ANOTHER_USER,
  Profile,
  EDIT_USER,
  CLEAR_AUTH_ERROR,
  CLEAR_USER_ACTION_ERROR,
  USER_ACTION_ERROR,
  FOLLOWING_MODAL_OPENED,
  FETCH_FOLLOWING,
  FETCH_FOLLOWERS,
  ProfileBrief,
  AnotherUserProfile,
  FOLLOW,
  UNFOLLOW,
  UserFollowingResponse,
  FETCH_RECOMMENDATIONS_LOADING,
  FETCH_RECOMMENDATIONS,
} from "../actionTypes/userActionTypes";
import { enqueueSnackbar, successSnackbarConfig } from "./uiActions";
import { ThunkActionWithPromise, ThunkActionVoid } from "..";

export const logout = () => (dispatch: Dispatch<UserDispatchTypes>) => {
  localStorage.removeItem("token");
  dispatch({ type: CLEAR_DATA });
};

export const clearAuthError = () => (dispatch: Dispatch<UserDispatchTypes>) => {
  dispatch({ type: CLEAR_AUTH_ERROR });
};
export const clearUserActionError =
  () => (dispatch: Dispatch<UserDispatchTypes>) => {
    dispatch({ type: CLEAR_USER_ACTION_ERROR });
  };
export const tryLocalSignIn =
  () => async (dispatch: Dispatch<UserDispatchTypes>) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const userResponse = await getCurrentUser();
    if (userResponse?.data) {
      console.log("userResponse?.data", userResponse?.data);
      dispatch({
        type: FETCH_CURRENT_USER,
        payload: userResponse.data,
      });
    }
  };

export const signin =
  (username: string, password: string) =>
  async (dispatch: Dispatch<UserDispatchTypes>) => {
    try {
      const response = await http.post(api.AUTH_TOKEN, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      dispatch({
        type: SIGN_IN,
        payload: {
          token,
        },
      });
      const userResponse = await getCurrentUser();
      if (userResponse?.data) {
        dispatch({
          type: FETCH_CURRENT_USER,
          payload: { ...userResponse.data },
        });
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
export const signup =
  (username: string, name: string, surname: string, password: string) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const response = await http.post(api.USERS, {
        username,
        first_name: name,
        last_name: surname,
        password,
      });
      dispatch(
        enqueueSnackbar({
          text: `User ${response.data.username} has been created successfully`,
          ...successSnackbarConfig,
        })
      );
      history.push("/signin");
    } catch (err) {
      console.log(err);
    }
  };

export const fetchCurrentUser =
  () => async (dispatch: Dispatch<UserDispatchTypes>) => {
    try {
      const userResponse = await getCurrentUser();
      if (userResponse?.data) {
        dispatch({
          type: FETCH_CURRENT_USER,
          payload: { ...userResponse.data },
        });
      }
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Can't fetch current user",
        },
      });
    }
  };

export const fetchRecommendations = (): ThunkActionVoid => async (dispatch) => {
  dispatch({
    type: FETCH_RECOMMENDATIONS_LOADING,
    payload: true,
  });
  try {
    const response = await http.get<ProfileBrief[]>(`${api.USERS}random`);
    dispatch({
      type: FETCH_RECOMMENDATIONS,
      payload: response.data,
    });
  } finally {
    dispatch({
      type: FETCH_RECOMMENDATIONS_LOADING,
      payload: false,
    });
  }
};

export const fetchUserById =
  (userId: number): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      const response = await http.get<AnotherUserProfile>(
        `${api.USERS}${userId}/`
      );
      if (response?.data) {
        const user = response?.data;
        user.followers = [];
        user.following = [];
        dispatch({
          type: FETCH_ANOTHER_USER,
          payload: user,
        });
      }
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Can't fetch user",
        },
      });
    }
  };

export const editUser =
  (data: FormData): ThunkActionWithPromise<string> =>
  async (dispatch, getState) => {
    const user_id = getState().userState.currentUser?.id;
    try {
      const response = await http.patch<Profile>(
        `${api.USERS}${user_id}/`,
        data
      );
      dispatch({ type: EDIT_USER, payload: response?.data });
      return Promise.resolve("Profile've been updated successfully");
    } catch {
      const err = "Some error occured while updating user profile";
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: err,
        },
      });
      return Promise.reject(err);
    }
  };

export const openUserFollowingModal =
  (isFollowersModal: boolean, value: boolean): ThunkActionVoid =>
  (dispatch) => {
    dispatch({
      type: FOLLOWING_MODAL_OPENED,
      payload: {
        isFollowersModal,
        value,
      },
    });
  };

export const fetchUserFollowing =
  (userId: number, isCurrentUser = false): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      const response = await http.get<ProfileBrief[]>(
        `${api.FOLLOWING}${userId}`
      );
      //add check for isCurrentUser and change dispatch type for current or some another selected user
      dispatch({
        type: FETCH_FOLLOWING,
        payload: response.data,
      });
      return Promise.resolve();
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Error occured while fetching followings",
        },
      });
      return Promise.reject("Error while fetching followings");
    }
  };

export const fetchUserFollowers =
  (userId: number, isCurrentUser = false): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      const response = await http.get<ProfileBrief[]>(
        `${api.FOLLOWERS}${userId}`
      );
      //add check for isCurrentUser and change dispatch type for current or some another selected user
      dispatch({
        type: FETCH_FOLLOWERS,
        payload: response.data,
      });
      return Promise.resolve();
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Error occured while fetching followers",
        },
      });
      return Promise.reject("Error while fetching followers");
    }
  };

const getCurrentUser = async () => {
  const response = await http.get<Profile>(api.AUTH_ME);
  return response;
};

export const follow =
  (userToFollowId: number): ThunkActionWithPromise<void> =>
  async (dispatch, getState) => {
    const currUser = getState().userState.currentUser;
    if (!currUser) return Promise.reject();

    try {
      const response = await http.post<UserFollowingResponse>(
        api.USER_FOLLOWING,
        {
          user: currUser.id,
          following_user: userToFollowId,
        }
      );
      dispatch({
        type: FOLLOW,
        payload: {
          user: response.data.user,
          following_user: response.data.user,
        },
      });
      return Promise.resolve();
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Oops, action failed",
        },
      });
      return Promise.reject();
    }
  };

export const unfollow =
  (userToFollowId: number): ThunkActionWithPromise<void> =>
  async (dispatch, getState) => {
    const currUser = getState().userState.currentUser;
    if (!currUser) return Promise.reject();
    try {
      await http.delete(
        `${api.FOLLOWING_DELETE}${currUser.id}/${userToFollowId}`
      );
      dispatch({
        type: UNFOLLOW,
        payload: {
          userId: currUser.id,
          userToFollowId,
        },
      });
      return Promise.resolve();
    } catch {
      dispatch({
        type: USER_ACTION_ERROR,
        payload: {
          error: "Oops, action failed",
        },
      });
      return Promise.reject();
    }
  };
