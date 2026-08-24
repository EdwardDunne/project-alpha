import { Dispatch, SetStateAction, useCallback, useState } from "react"

// Same as useState except the state persists on component unmount.
// This hook was created to persist filter state but can be used generically.
// This method was lighter weight than using redux, and, moving the filter's
// state further up the tree wouldn't make sense since their closets parent
// is HomePageRouter
const persistedStateCache = new Map<string, unknown>()

export function usePersistedState<T>(
    cacheKey: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    // Using a function for state here so that it only runs once on initial render
    const [value, setValue] = useState<T>(() =>
        persistedStateCache.has(cacheKey)
            ? (persistedStateCache.get(cacheKey) as T)
            : initialValue,
    )

    const setPersistedValue: Dispatch<SetStateAction<T>> = useCallback(
        (next) => {
            setValue((prev) => {
                const resolved =
                    typeof next === "function"
                        ? (next as (prev: T) => T)(prev)
                        : next
                persistedStateCache.set(cacheKey, resolved)
                return resolved
            })
        },
        [cacheKey],
    )

    return [value, setPersistedValue]
}
