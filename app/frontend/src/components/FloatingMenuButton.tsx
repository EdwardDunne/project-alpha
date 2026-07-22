import React from "react"

interface Props {
    onClick: () => void
    ariaLabel: string
}

const FloatingMenuButton: React.FC<Props> = ({ onClick, ariaLabel }) => {
    return (
        <button
            className="md:hidden fixed top-[7rem] left-6 z-50 w-14 h-14 bg-brand rounded-full shadow-lg flex flex-col items-center justify-center gap-[5px]"
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <span className="block w-6 h-[3px] bg-white rounded-full" />
            <span className="block w-6 h-[3px] bg-white rounded-full" />
            <span className="block w-6 h-[3px] bg-white rounded-full" />
        </button>
    )
}

export default FloatingMenuButton
