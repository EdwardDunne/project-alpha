import { useCallback, useEffect, useRef, useState } from "react"
import { fetchBooksPage, BooksPageFilters } from "../actions/comics"
import { getErrorMessage } from "../utils/apiError"
import { toast } from "react-toastify"
import { Book } from "../types"

// Drives a server-paginated, filtered book feed with infinite scroll.
// Shared by ComicsPage (public grid) and ComicsAdminPage (admin list) -
// both need the exact same fetch/paginate/de-dupe-stale-requests state
// machine, they only differ in how they render each book and lay out the
// filter panel.
export function usePaginatedBooks(
    filters: BooksPageFilters,
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
) {
    const [books, setBooks] = useState<Book[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [reloadToken, setReloadToken] = useState(0)

    const sentinelRef = useRef<HTMLDivElement | null>(null)
    // Guards against a slow, now-stale request overwriting the results of a
    // newer one (e.g. the user changes filters again before the previous
    // fetch has come back).
    const requestIdRef = useRef(0)

    // Reset to page 1 whenever the (debounced) filters change, or a caller
    // explicitly asks for a reload (e.g. after adding/editing/deleting a
    // book).
    useEffect(() => {
        const requestId = ++requestIdRef.current
        setLoading(true)
        setHasMore(true)

        fetchBooksPage(1, filters)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setBooks(result.books)
                setPage(1)
                setHasMore(result.hasMore)
            })
            .catch((error) => {
                console.error(error)
                toast.error(getErrorMessage(error, "Error getting books..."))
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, reloadToken])

    const loadNextPage = useCallback(() => {
        if (loading || !hasMore) return

        const nextPage = page + 1
        const requestId = ++requestIdRef.current
        setLoading(true)

        fetchBooksPage(nextPage, filters)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setBooks((prev) => [...prev, ...result.books])
                setPage(nextPage)
                setHasMore(result.hasMore)
            })
            .catch((error) => {
                console.error(error)
                toast.error(getErrorMessage(error, "Error getting books..."))
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false)
            })
    }, [loading, hasMore, page, filters])

    // Load the next page once the sentinel scrolls into view.
    useEffect(() => {
        const sentinel = sentinelRef.current
        const root = scrollContainerRef.current
        if (!sentinel || !root) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextPage()
            },
            { root, rootMargin: "600px" },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [loadNextPage, scrollContainerRef])

    const reload = useCallback(() => setReloadToken((t) => t + 1), [])

    return { books, loading, hasMore, sentinelRef, reload }
}
