import { useCallback, useEffect, useRef, useState } from "react"
import { fetchBooksPage, BooksPageFilters } from "../actions/comics"
import { getErrorMessage } from "../utils/apiError"
import { toast } from "react-toastify"
import { Book } from "../types"

// Drives a server-paginated, filtered book feed with infinite scroll.

type CachedFeed = {
    books: Book[]
    page: number
    hasMore: boolean
    filtersSignature: string
}

// Stateful map outside of react for persisting comics and comicsAdmin page states
const feedCache = new Map<string, CachedFeed>()

function signatureFor(filters: BooksPageFilters): string {
    return JSON.stringify(filters)
}

export function usePaginatedBooks(
    cacheKey: string,
    filters: BooksPageFilters,
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
) {
    const signature = signatureFor(filters)
    const cached = feedCache.get(cacheKey)
    // Only fetch new data if the filters have actually changed.
    const freshCache =
        cached?.filtersSignature === signature ? cached : undefined

    const [books, setBooks] = useState<Book[]>(freshCache?.books ?? [])
    const [page, setPage] = useState(freshCache?.page ?? 1)
    const [hasMore, setHasMore] = useState(freshCache?.hasMore ?? true)
    const [loading, setLoading] = useState(false)
    const [reloadToken, setReloadToken] = useState(0)

    const sentinelRef = useRef<HTMLDivElement | null>(null)
    // Guards against a stale request overwriting the results of a
    // newer one
    const requestIdRef = useRef(0)
    // Skip fetch on initial render not on filter changes.
    const skipNextFetchRef = useRef(Boolean(freshCache))

    // Reset to page 1 whenever the filters change, or after adding/editing/deleting
    // a book
    useEffect(() => {
        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false
            return
        }

        const requestId = ++requestIdRef.current
        setLoading(true)
        setHasMore(true)

        fetchBooksPage(1, filters)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setBooks(result.books)
                setPage(1)
                setHasMore(result.hasMore)
                feedCache.set(cacheKey, {
                    books: result.books,
                    page: 1,
                    hasMore: result.hasMore,
                    filtersSignature: signature,
                })
            })
            .catch((error) => {
                console.error(error)
                toast.error(getErrorMessage(error, "Error getting books..."))
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signature, reloadToken])

    const loadNextPage = useCallback(() => {
        if (loading || !hasMore) return

        const nextPage = page + 1
        const requestId = ++requestIdRef.current
        setLoading(true)

        fetchBooksPage(nextPage, filters)
            .then((result) => {
                if (requestId !== requestIdRef.current) return
                setBooks((prev) => {
                    const combined = [...prev, ...result.books]
                    feedCache.set(cacheKey, {
                        books: combined,
                        page: nextPage,
                        hasMore: result.hasMore,
                        filtersSignature: signature,
                    })
                    return combined
                })
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
    }, [loading, hasMore, page, filters, cacheKey, signature])

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

    const reload = useCallback(() => {
        // Invalidate cache of both pages when a change is made from comics admin.
        feedCache.clear()
        setReloadToken((t) => t + 1)
    }, [])

    return { books, loading, hasMore, sentinelRef, reload }
}
