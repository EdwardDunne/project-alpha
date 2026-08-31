import axios from "axios"
import { Dispatch } from "redux"
import { toast } from "react-toastify"
import { loadUser } from "./profile"
import httpUtil from "../utils/httpUtil"
import { getErrorMessage } from "../utils/apiError"
import { AppDispatch } from "../store"
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    UPDATE_IS_STAFF,
} from "./types"

// Standard Authenication Check
export const checkAuthenticated = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.getHeaders("GET"),
    }

    try {
        const res = await axios.get(
            `${window.location.origin}/api/authenticated`,
            config,
        )

        if (res.data.isAuthenticated === "success") {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
                payload: true,
            })
            dispatch({
                type: UPDATE_IS_STAFF,
                payload: res.data,
            })
        } else {
            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false,
            })
        }
    } catch (error) {
        console.error(error)
        dispatch({
            type: AUTHENTICATED_FAIL,
            payload: false,
        })
    }
}

// User Login
export const login =
    (email: string, password: string) => async (dispatch: AppDispatch) => {
        const config = {
            headers: httpUtil.getHeaders("POST"),
        }

        const body = JSON.stringify({ email, password })

        try {
            await axios.post(
                `${window.location.origin}/api/login`,
                body,
                config,
            )

            dispatch({
                type: LOGIN_SUCCESS,
            })

            dispatch(loadUser())
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    "Something went wrong logging in. Please try again.",
                ),
            )
            console.error(error)
            dispatch({
                type: LOGIN_FAIL,
            })
        }
    }

// User Logout
export const logout = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    try {
        await axios.post(`${window.location.origin}/api/logout`, null, config)

        dispatch({
            type: LOGOUT_SUCCESS,
        })
    } catch (error) {
        console.error(error)
        dispatch({
            type: LOGOUT_FAIL,
        })
    }
}

// Register New User
export const register =
    (email: string, password: string, re_password: string) =>
    async (dispatch: Dispatch) => {
        const config = {
            headers: httpUtil.getHeaders("POST"),
        }

        const body = JSON.stringify({ email, password, re_password })

        try {
            await axios.post(
                `${window.location.origin}/api/register`,
                body,
                config,
            )

            dispatch({
                type: REGISTER_SUCCESS,
            })
        } catch (error) {
            toast.error(
                getErrorMessage(
                    error,
                    "Something went wrong registering. Please try again.",
                ),
            )
            console.error(error)
            dispatch({
                type: REGISTER_FAIL,
            })
        }
    }

// Request Password Reset
export const requestPasswordReset = async (email: string): Promise<boolean> => {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    const body = JSON.stringify({ email })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/password-reset/request`,
            body,
            config,
        )

        toast.dismiss()
        toast.success(res.data.success)
        return true
    } catch (error) {
        toast.error(
            getErrorMessage(error, "Something went wrong. Please try again."),
        )
        console.error(error)
        return false
    }
}

// Confirm password reset
export const resetPassword = async (
    uidb64: string,
    token: string,
    password: string,
    re_password: string,
): Promise<boolean> => {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    const body = JSON.stringify({ uidb64, token, password, re_password })

    try {
        const res = await axios.post(
            `${window.location.origin}/api/password-reset/confirm`,
            body,
            config,
        )
        toast.dismiss()
        toast.success(res.data.success)
        return true
    } catch (error) {
        toast.error(
            getErrorMessage(error, "Something went wrong. Please try again."),
        )
        console.error(error)
        return false
    }
}

// Delete user account
export const deleteAccount = () => async (dispatch: Dispatch) => {
    const config = {
        headers: httpUtil.getHeaders("POST"),
    }

    try {
        await axios.post(
            `${window.location.origin}/api/delete-account`,
            null,
            config,
        )

        dispatch({
            type: DELETE_USER_SUCCESS,
        })
    } catch (error) {
        console.error(error)
        dispatch({
            type: DELETE_USER_FAIL,
        })
    }
}
