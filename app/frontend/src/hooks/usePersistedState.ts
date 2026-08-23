import { Dispatch, SetStateAction, useCallback, useState } from "react"

// same as useState except the state persists on component unmount.
const persistedStateCache = new Map<string, unknown>()

export function usePersistedState<T>(
    cacheKey: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
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
