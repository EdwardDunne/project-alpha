import React, { useEffect } from "react"
import axios from "axios"

// Seeds the csrftoken cookie so httpUtil's X-CSRFToken header has
// something to read on a first POST.
const CSRFToken: React.FC = () => {
    useEffect(() => {
        axios
            .get(`${window.location.origin}/api/csrf-cookie`)
            .catch((error) => console.error(error))
    }, [])

    return null
}

export default CSRFToken
