import * as React from "react"
import Popper from "@mui/material/Popper"
import { autocompleteClasses } from "@mui/material/Autocomplete"
import { styled } from "@mui/material/styles"
import { FixedSizeList, ListChildComponentProps } from "react-window"

const LISTBOX_PADDING = 8 // px
const ITEM_SIZE = 48 // px
const MAX_VISIBLE_ROWS = 8
const LOAD_MORE_THRESHOLD = 5 // rows from the end

function renderRow({ data, index, style }: ListChildComponentProps) {
    const dataSet = data[index]
    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
    }
    const { key, ...optionProps } = dataSet[0]

    return (
        <li
            key={key}
            {...optionProps}
            style={inlineStyle}
        >
            {dataSet[1]}
        </li>
    )
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef<HTMLDivElement>(
    function OuterElementType(props, ref) {
        const outerProps = React.useContext(OuterElementContext)
        return (
            <div
                ref={ref}
                {...props}
                {...outerProps}
            />
        )
    },
)

export interface VirtualizedSearchController {
    hasMore: boolean
    loading: boolean
    loadMore: () => void
}

export function createVirtualizedListbox(
    controllerRef: React.MutableRefObject<VirtualizedSearchController>,
) {
    return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
        function VirtualizedListbox(props, ref) {
            const { children, ...other } = props
            const itemData = children as React.ReactElement[]
            const itemCount = itemData.length
            const height =
                Math.min(itemCount, MAX_VISIBLE_ROWS) * ITEM_SIZE +
                2 * LISTBOX_PADDING

            const handleItemsRendered = ({
                visibleStopIndex,
            }: {
                visibleStopIndex: number
            }) => {
                const { hasMore, loading, loadMore } = controllerRef.current
                if (
                    hasMore &&
                    !loading &&
                    visibleStopIndex >= itemCount - LOAD_MORE_THRESHOLD
                ) {
                    loadMore()
                }
            }

            return (
                <div ref={ref}>
                    <OuterElementContext.Provider value={other}>
                        <FixedSizeList
                            itemData={itemData}
                            height={height || ITEM_SIZE}
                            width="100%"
                            outerElementType={OuterElementType}
                            innerElementType="ul"
                            itemSize={ITEM_SIZE}
                            overscanCount={5}
                            itemCount={itemCount}
                            onItemsRendered={handleItemsRendered}
                        >
                            {renderRow}
                        </FixedSizeList>
                    </OuterElementContext.Provider>
                </div>
            )
        },
    )
}

// Resets the listbox's own padding/margins so the virtualized rows can
// position themselves absolutely without the default Autocomplete listbox
// padding throwing off row offsets.
export const VirtualizedPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
})
