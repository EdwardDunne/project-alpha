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
    // A "generation" of the feed - only a real reset (filter change, reload)
    // starts a new one. loadNextPage never bumps this; it only ever reads
    // the generation it started under and checks that against the current
    // one when its fetch resolves. That way a reset always wins by
    // definition, rather than "whichever request's completion happened to
    // see the higher shared counter" - the previous shared-counter version
    // of this guard let a stale loadNextPage call (e.g. one fired from a
    // closure that hadn't yet seen loading flip true, more likely on a slow
    // mobile CPU) bump the counter *past* a legitimate page-1 reset's own
    // id, causing the reset's correct results to be discarded as "stale"
    // and only the stray next-page fetch's results to end up on screen.
    const generationRef = useRef(0)
    // Skip fetch on initial render not on filter changes.
    const skipNextFetchRef = useRef(Boolean(freshCache))

    // Reset to page 1 whenever the filters change, or after adding/editing/deleting
    // a book
    useEffect(() => {
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
    }, [signature, reloadToken])

    const loadNextPage = useCallback(() => {
        if (loading || !hasMore) return

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
    }, [loading, hasMore, page, filters, cacheKey, signature])

    // loadNextPage gets a new identity on every loading/hasMore/page change -
    // several times per fetch cycle. The observer below must stay mounted
    // across all of that and just call whichever version is current,
    // otherwise tearing it down and recreating it mid-fetch (a fresh
    // IntersectionObserver fires immediately with the sentinel's current
    // state) can cascade into loading every remaining page in one burst -
    // most visibly right after clearing a filter, when a short filtered
    // grid suddenly becomes a long one and the sentinel is still in range
    // for each recreation in the sequence.
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

    return { books, loading, hasMore, sentinelRef, reload }
}
