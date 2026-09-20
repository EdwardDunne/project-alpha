import React, { useMemo } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"

interface Option {
    id: number
}

interface Props<T extends Option> {
    label: string
    options: T[]
    selected: T[]
    onChange: (selected: T[]) => void
    getOptionLabel: (option: T) => string
    searchPlaceholder?: string
    query: string
    onQueryChange: (query: string) => void
    hasMore: boolean
    loading: boolean
    onLoadMore: () => void
}

const ROW_HEIGHT = 40
// This app sets html { font-size: 62.5% } (see styles/main.css), so 1rem =
// 10px here - matches MobileMultiSelect's max-h-[20rem].
const MAX_LIST_HEIGHT = 200
const LOAD_MORE_THRESHOLD = 5

// Mobile filter selector for options utilizing server-side
// search and pagination
function VirtualizedMobileMultiSelect<T extends Option>({
    label,
    options,
    selected,
    onChange,
    getOptionLabel,
    searchPlaceholder = "Search...",
    query,
    onQueryChange,
    hasMore,
    loading,
    onLoadMore,
}: Props<T>) {
    const isSelected = (option: T) => selected.some((s) => s.id === option.id)

    const toggle = (option: T) => {
        onChange(
            isSelected(option)
                ? selected.filter((s) => s.id !== option.id)
                : [...selected, option],
        )
    }

    // Selected options are pinned to the top (in selection order) so they
    // stay visible while scrolling/searching a long list, even ones that
    // have scrolled out of the currently loaded page. Unselecting one
    // drops it back into the regular list below.
    const displayOptions = useMemo(() => {
        const selectedIds = new Set(selected.map((s) => s.id))
        const rest = options.filter((o) => !selectedIds.has(o.id))
        return [...selected, ...rest]
    }, [options, selected])

    const handleItemsRendered = ({
        visibleStopIndex,
    }: {
        visibleStopIndex: number
    }) => {
        if (
            hasMore &&
            !loading &&
            visibleStopIndex >= displayOptions.length - LOAD_MORE_THRESHOLD
        ) {
            onLoadMore()
        }
    }

    const Row = ({ index, style, data }: ListChildComponentProps<T[]>) => {
        const option = data[index]
        return (
            <label
                style={style}
                className="flex items-center gap-2.5 px-3 py-2 text-[1.4rem] text-white cursor-pointer hover:bg-white/5"
            >
                <input
                    type="checkbox"
                    checked={isSelected(option)}
                    onChange={() => toggle(option)}
                    className="w-[1.8rem] h-[1.8rem] shrink-0 accent-brand"
                />
                <span className="truncate">{getOptionLabel(option)}</span>
            </label>
        )
    }

    return (
        <div className="mt-3 md:hidden">
            <span className="block mb-1.5 text-[1.3rem] font-semibold text-gray-300 uppercase tracking-wider">
                {label}
            </span>
            <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#3f4a58] border border-gray-500 rounded px-3 py-2 text-[1.4rem] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <div
                className="mt-2 rounded border border-gray-600"
                style={{ height: MAX_LIST_HEIGHT }}
            >
                {displayOptions.length === 0 ? (
                    <div className="px-3 py-2 text-[1.3rem] text-gray-400">
                        {loading ? "Loading..." : "No matches."}
                    </div>
                ) : (
                    <FixedSizeList
                        height={MAX_LIST_HEIGHT}
                        width="100%"
                        itemCount={displayOptions.length}
                        itemSize={ROW_HEIGHT}
                        itemData={displayOptions}
                        overscanCount={5}
                        onItemsRendered={handleItemsRendered}
                    >
                        {Row}
                    </FixedSizeList>
                )}
            </div>
        </div>
    )
}

export default VirtualizedMobileMultiSelect
