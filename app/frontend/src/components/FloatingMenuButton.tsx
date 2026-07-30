import React from "react"

interface Props {
    onClick: () => void
    ariaLabel: string
    icon?: React.ReactNode
}

const FloatingMenuButton: React.FC<Props> = ({ onClick, ariaLabel, icon }) => {
    return (
        <button
            className="md:hidden fixed top-[7rem] left-6 z-50 w-14 h-14 bg-brand rounded-full shadow-lg flex items-center justify-center"
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {icon ?? (
                <span className="flex flex-col items-center justify-center gap-[5px]">
                    <span className="block w-6 h-[3px] bg-white rounded-full" />
                    <span className="block w-6 h-[3px] bg-white rounded-full" />
                    <span className="block w-6 h-[3px] bg-white rounded-full" />
                </span>
            )}
        </button>
    )
}

export default FloatingMenuButton
