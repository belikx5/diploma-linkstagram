import { ProfileBrief } from "./userActionTypes";

export const FETCH_DEAD_PROFILE = "FETCH_DEAD_PROFILE";
export const FETCH_DEAD_PROFILE_LOADING = "FETCH_DEAD_PROFILE_LOADING";

export const CREATE_DEAD_PROFILE = "CREATE_DEAD_PROFILE";
export const UPDATE_DEAD_PROFILE = "UPDATE_DEAD_PROFILE";
export const DELETE_DEAD_PROFILE = "DELETE_DEAD_PROFILE";

export type DeadProfile = {
  id: number;
  user: ProfileBrief;
  trusted_users: ProfileBrief[];
};

export interface FetchDeadProfile {
  type: typeof FETCH_DEAD_PROFILE;
  payload: DeadProfile;
}

export interface FetchDeadProfileLoading {
  type: typeof FETCH_DEAD_PROFILE_LOADING;
  payload: boolean;
}

export interface CreateDeadProfile {
  type: typeof CREATE_DEAD_PROFILE;
  payload: DeadProfile;
}

export interface UpdateDeadProfile {
  type: typeof UPDATE_DEAD_PROFILE;
  payload: DeadProfile;
}

export interface DeleteDeadProfile {
  type: typeof DELETE_DEAD_PROFILE;
  payload: null;
}

export type deadProfileDispatchTypes =
  | FetchDeadProfile
  | FetchDeadProfileLoading
  | DeleteDeadProfile
  | CreateDeadProfile
  | UpdateDeadProfile;
