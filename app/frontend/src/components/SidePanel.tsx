import React, { useEffect, useState } from "react"

interface Props {
    open: boolean
    onClose: () => void
    closeAriaLabel: string
    children: React.ReactNode
}

const SidePanel: React.FC<Props> = ({
    open,
    onClose,
    closeAriaLabel,
    children,
}) => {
    const [collapsed, setCollapsed] = useState(false)

    // Handles bug where selecting an input field near
    // the bottom of the side panel scrolls overall page
    useEffect(() => {
        if (!open) return

        const isDesktop = window.matchMedia("(min-width: 768px)")
        let scrollY = 0
        let locked = false

        const lock = () => {
            if (locked) return
            locked = true
            scrollY = window.scrollY
            const { body } = document
            body.style.position = "fixed"
            body.style.top = `-${scrollY}px`
            body.style.left = "0"
            body.style.right = "0"
        }

        const unlock = () => {
            if (!locked) return
            locked = false
            const { body } = document
            body.style.position = ""
            body.style.top = ""
            body.style.left = ""
            body.style.right = ""
            window.scrollTo(0, scrollY)
        }

        const syncToBreakpoint = () => {
            if (isDesktop.matches) unlock()
            else lock()
        }

        syncToBreakpoint()
        isDesktop.addEventListener("change", syncToBreakpoint)

        return () => {
            isDesktop.removeEventListener("change", syncToBreakpoint)
            unlock()
        }
    }, [open])

    return (
        <>
            {/* Mobile: backdrop */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 z-[55] bg-black/50"
                    onClick={onClose}
                />
            )}

            <div className="md:sticky md:top-[6rem] md:h-[calc(100dvh-6rem)] md:shrink-0 md:flex">
                <div
                    className={`fixed top-0 left-0 h-full w-[30rem] max-w-[85vw] z-[60] bg-[#313a46]
                                overflow-y-auto overflow-x-hidden transition-all duration-300
                                ${open ? "translate-x-0" : "-translate-x-full"}
                                md:static md:z-auto md:translate-x-0 md:max-w-none
                                ${collapsed ? "md:w-0" : "md:w-[35rem]"}`}
                >
                    <button
                        className="md:hidden absolute top-4 right-4 text-white text-[2.4rem] leading-none z-10"
                        onClick={onClose}
                        aria-label={closeAriaLabel}
                    >
                        ✕
                    </button>
                    <div className="w-full md:w-[35rem] h-full">{children}</div>
                </div>
                <button
                    className="hidden md:flex w-8 shrink-0 mt-4 h-14 bg-brand text-white rounded-r-md shadow-lg items-center justify-center text-[4.2rem] leading-none"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={
                        collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                >
                    {collapsed ? "›" : "‹"}
                </button>
            </div>
        </>
    )
}

export default SidePanel
