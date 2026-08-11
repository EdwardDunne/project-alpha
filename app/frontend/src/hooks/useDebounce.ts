import { useEffect, useState } from "react"

// Returns a debounced copy of `value` that only updates once `value` has
// stopped changing for `delayMs`. Useful for expensive derived work (like
// filtering a list) that shouldn't re-run on every keystroke/selection.
export function useDebounce<T>(value: T, delayMs = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delayMs)
        return () => clearTimeout(timeout)
    }, [value, delayMs])

    return debouncedValue
}
