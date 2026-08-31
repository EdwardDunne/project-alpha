import axios from "axios"
import { Dispatch } from "redux"
import httpUtil from "../utils/httpUtil"
import { getErrorMessage } from "../utils/apiError"
import { toast } from "react-toastify"
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
} from "./types"

export const loadUser = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.getHeaders("GET"),
    }

    try {
        const res = await axios.get(
            `${window.location.origin}/api/profile/user`,
            config,
        )

        dispatch({
            type: LOAD_USER_PROFILE_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        // Logged for debugging only, same as
        // checkAuthenticated's equivalent boot-time check.
        console.error(error)
        dispatch({
            type: LOAD_USER_PROFILE_FAIL,
        })
    }
}

export const updateProfile =
    (first_name: string, last_name: string) => async (dispatch: Dispatch) => {
        const config = {
            headers: httpUtil.getHeaders("PUT"),
        }

        const body = JSON.stringify({
            first_name: first_name,
            last_name: last_name,
        })

        try {
            const res = await axios.put(
                `${window.location.origin}/api/profile/user/update`,
                body,
                config,
            )
            toast.dismiss()
            toast.success("Profile Updated!")
            dispatch({
                type: UPDATE_USER_PROFILE_SUCCESS,
                payload: res.data,
            })
        } catch (error) {
            console.error(error)
            toast.error(getErrorMessage(error, "Something went wrong..."))
            dispatch({
                type: UPDATE_USER_PROFILE_FAIL,
            })
        }
    }
