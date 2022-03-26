import { ThunkActionVoid } from "..";
import api from "../../services/api";
import http from "../../services/http";
import { FETCH_DEAD_PROFILE, FETCH_DEAD_PROFILE_LOADING } from "../actionTypes/deadProfileActionTypes";

export const fetchDeadProfileLoading = (val:boolean):ThunkActionVoid => dispatch => {
    dispatch({
        type: FETCH_DEAD_PROFILE_LOADING,
        payload: val
    })
}

export const fetchDeadProfile = (userProfileId: number): ThunkActionVoid => async(dispatch) =>{
    dispatch(fetchDeadProfileLoading(true));
    try {
        const response = await http.get(`${api.DEAD_USERS}?user__id=${userProfileId}`);
        dispatch({
            type: FETCH_DEAD_PROFILE,
            payload: response.data
        })
    } finally {
        dispatch(fetchDeadProfileLoading(false));
    }
}