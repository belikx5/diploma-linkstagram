import { ThunkActionVoid, ThunkActionWithPromise } from "..";
import api from "../../services/api";
import http from "../../services/http";
import {
  CREATE_DEAD_PROFILE,
  DeadProfile,
  DELETE_DEAD_PROFILE,
  FETCH_DEAD_PROFILE,
  FETCH_DEAD_PROFILE_LOADING,
  UPDATE_DEAD_PROFILE,
} from "../actionTypes/deadProfileActionTypes";

export const fetchDeadProfileLoading =
  (val: boolean): ThunkActionVoid =>
  (dispatch) => {
    dispatch({
      type: FETCH_DEAD_PROFILE_LOADING,
      payload: val,
    });
  };

export const fetchDeadProfile =
  (userProfileId: number): ThunkActionVoid =>
  async (dispatch) => {
    dispatch(fetchDeadProfileLoading(true));
    try {
      const response = await http.get<DeadProfile[]>(
        `${api.DEAD_USERS}?user__id=${userProfileId}`
      );
      const deadProfiles = response.data;
      deadProfiles.length > 0 &&
        dispatch({
          type: FETCH_DEAD_PROFILE,
          payload: deadProfiles[0],
        });
    } finally {
      dispatch(fetchDeadProfileLoading(false));
    }
  };

export const createDeadProfile =
  (
    userProfileId: number,
    trustedUsers: number[]
  ): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      const response = await http.post(api.DEAD_USERS, {
        user: userProfileId,
        trusted_users: trustedUsers,
      });
      dispatch({
        type: CREATE_DEAD_PROFILE,
        payload: {
          ...response.data,
          trusted_users: response.data.trusted_users.map((id: number) => ({
            id,
          })),
        },
      });
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  };

export const deleteDeadProfile =
  (deadProfileId: number): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      await http.delete(`${api.DEAD_USERS}${deadProfileId}`);
      dispatch({
        type: DELETE_DEAD_PROFILE,
        payload: null,
      });
      return Promise.resolve();
    } catch {
      return Promise.reject();
    }
  };

export const updateDeadProfile =
  (
    deadProfileId: number,
    trustedUsers: number[]
  ): ThunkActionWithPromise<void> =>
  async (dispatch) => {
    try {
      const response = await http.patch(`${api.DEAD_USERS}${deadProfileId}/`, {
        trusted_users: trustedUsers,
      });
      dispatch({
        type: UPDATE_DEAD_PROFILE,
        payload: {
          ...response.data,
          trusted_users: response.data.trusted_users.map((id: number) => ({
            id,
          })),
        },
      });
      return Promise.resolve();
    } catch {}
  };
