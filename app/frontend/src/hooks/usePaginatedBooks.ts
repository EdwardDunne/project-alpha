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
    // Set to false to hold off on initial fetch
    enabled = true,
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
    // GenerationRef is incremented each time the filters signature changes
    // or if the reloadToken triggers the page to reload (due to changes made
    // on the Admin page). A ref is used so that asynchronous invocations of
    // the below useEffect can track if the current invocation is the latest
    // invocation, and if it is not, don't carry out the state changes
    const generationRef = useRef(0)
    // Skip fetch on initial render not on filter changes.
    const skipNextFetchRef = useRef(Boolean(freshCache))

    // Reset to page 1 whenever the filters change, or after
    // adding/editing/deleting a book
    useEffect(() => {
        if (!enabled) return

        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false
            return
        }

        const generation = ++generationRef.current
        setLoading(true)
        setHasMore(true)

        fetchBooksPage(1, filters)
            .then((result) => {
                if (generation !== generationRef.current) return
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
                if (generation === generationRef.current) setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signature, reloadToken, enabled])

    // useCallback used here mostly so that this function doesn't reevaluate on every render
    const loadNextPage = useCallback(() => {
        if (!enabled || loading || !hasMore) return

        const nextPage = page + 1
        const generation = generationRef.current
        setLoading(true)

        fetchBooksPage(nextPage, filters)
            .then((result) => {
                if (generation !== generationRef.current) return
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
                if (generation === generationRef.current) setLoading(false)
            })
    }, [enabled, loading, hasMore, page, filters, cacheKey, signature])

    // The below useEffect only renders once, this way we don't
    // create a new instance of IntersectionObserver on every rerender.
    // Since we are utilizing a useEffect to create the observer we need
    // to put loadNextPage in a ref so that the observer has the most
    // up to date version of the loadNextPage function to call
    const loadNextPageRef = useRef(loadNextPage)
    useEffect(() => {
        loadNextPageRef.current = loadNextPage
    }, [loadNextPage])

    // Load the next page once the sentinel scrolls into view.
    useEffect(() => {
        const sentinel = sentinelRef.current
        const root = scrollContainerRef.current
        if (!sentinel || !root) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadNextPageRef.current()
            },
            { root, rootMargin: "600px" },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [scrollContainerRef])

    const reload = useCallback(() => {
        // Invalidate cache of both pages when a change is made from comics admin.
        feedCache.clear()
        setReloadToken((t) => t + 1)
    }, [])

    // Update a single book in place (after a wishlist/owned toggle) so we
    // don't have to refetch the whole list for each change.
    const updateBook = useCallback(
        (bookId: number, patch: Partial<Book>) => {
            setBooks((prev) => {
                const updated = prev.map((b) =>
                    b.id === bookId ? { ...b, ...patch } : b,
                )
                const current = feedCache.get(cacheKey)
                if (current) {
                    feedCache.set(cacheKey, { ...current, books: updated })
                }
                return updated
            })
        },
        [cacheKey],
    )

    // Drop a single book from the list in place (after wishlist/owned toggle),
    // so it disappears immediately instead of waiting on a full reload.
    const removeBook = useCallback(
        (bookId: number) => {
            setBooks((prev) => {
                const updated = prev.filter((b) => b.id !== bookId)
                const current = feedCache.get(cacheKey)
                if (current) {
                    feedCache.set(cacheKey, { ...current, books: updated })
                }
                return updated
            })
        },
        [cacheKey],
    )

    return {
        books,
        // Still "loading" if fetches are being withheld by "enabled"
        loading: loading || !enabled,
        hasMore,
        sentinelRef,
        reload,
        updateBook,
        removeBook,
    }
}
