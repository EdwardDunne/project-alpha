import Cookies from "js-cookie"

type RequestType = "GET" | "POST" | "POSTFILE" | "PUT" | "DELETE"

interface Headers {
    Accept: string
    "Content-Type": string
    "X-CSRFToken"?: string
    [key: string]: string | undefined
}

function getHeaders(requestType: RequestType): Headers {
    const base: Headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    }

    switch (requestType) {
        case "POST":
        case "PUT":
        case "DELETE":
            return { ...base, "X-CSRFToken": Cookies.get("csrftoken") }
        case "POSTFILE":
            return {
                ...base,
                "Content-Type": "multipart/form-data",
                "X-CSRFToken": Cookies.get("csrftoken"),
            }
        case "GET":
        default:
            return base
    }
}

export default { getHeaders }
