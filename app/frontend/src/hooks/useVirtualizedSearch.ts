import { useEffect, useRef, useState } from "react"
import { NameSearchResult } from "../actions/comics"

const DEBOUNCE_MS = 300

// Searchable, paginated dropdown with a debounce. Fetches page
// 1 on query change, and provides loadMore() for a which you can
// call ass the user scrolls down
export function useVirtualizedSearch<T>(
    search: (query: string, page: number) => Promise<NameSearchResult<T>>,
) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [options, setOptions] = useState<T[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const requestIdRef = useRef(0)

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        const requestId = ++requestIdRef.current
        setLoading(true)
        search(debouncedQuery, 1)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setOptions(result.results)
                setHasMore(result.hasMore)
                setPage(1)
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false)
            })
    }, [debouncedQuery])

    const loadMore = () => {
        if (loading || !hasMore) return
        const requestId = ++requestIdRef.current
        const nextPage = page + 1
        setLoading(true)
        search(debouncedQuery, nextPage)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setOptions((prev) => [...prev, ...result.results])
                setHasMore(result.hasMore)
                setPage(nextPage)
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false)
            })
    }

    return { query, setQuery, options, hasMore, loading, loadMore }
}
