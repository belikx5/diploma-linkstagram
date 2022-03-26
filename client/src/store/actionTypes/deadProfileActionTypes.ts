import { ProfileBrief } from "./userActionTypes";

export const FETCH_DEAD_PROFILE = "FETCH_DEAD_PROFILE";
export const FETCH_DEAD_PROFILE_LOADING = "FETCH_DEAD_PROFILE_LOADING";

export type DeadProfile = {
    user: ProfileBrief;
    trusted_users: ProfileBrief[];
}


export interface FetchDeadProfile {
	type: typeof FETCH_DEAD_PROFILE;
    payload: DeadProfile;
}

export interface FetchDeadProfileLoading {
    type: typeof FETCH_DEAD_PROFILE_LOADING;
    payload: boolean;
}


export type deadProfileDispatchTypes = FetchDeadProfile | FetchDeadProfileLoading;
