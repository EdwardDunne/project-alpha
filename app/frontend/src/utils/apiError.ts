import axios from "axios"

// Handle Axios errors and extract specific error string from response.
export function getErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
        return error.response.data.error
    }
    return fallback
}
