import { useEffect, useState } from "react"

// Simple debounce utilizong setTimeout
export function useDebounce<T>(value: T, delayMs = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delayMs)
        return () => clearTimeout(timeout)
    }, [value, delayMs])

    return debouncedValue
}
