import React from "react"
import ReactDom from "react-dom"
import { connect } from "react-redux"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
    onClose: () => void
    children: React.ReactNode
    // Optional previous/next arrows on the left/right edges; omit (or pass
    // undefined, e.g. at the ends of a list) to hide that arrow
    onPrevious?: () => void
    onNext?: () => void
}

const arrowClassName =
    "absolute md:top-1/2 top-[100%] -translate-y-1/2 z-[1002] w-12 h-12 flex items-center justify-center " +
    "rounded-full border-2 border-brand bg-white text-brand shadow-md " +
    "hover:bg-brand hover:text-white transition-colors flex justify-center items-center"

const DunneWebModal: React.FC<Props> = ({
    onClose,
    children,
    onPrevious,
    onNext,
}) => {
    return ReactDom.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/[0.43] z-[1000]"
                onClick={onClose}
            />
            {/* Positioning wrapper - no overflow so the arrows can hang over
                the edges of the scrolling panel without being clipped */}
            <div
                className="fixed z-[1001] w-[92vw] md:w-[85vw] lg:w-[65vw] xl:w-[50vw] max-w-[87.8rem]"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div
                    className="relative bg-white rounded-[0.6rem] max-h-[90dvh] overflow-y-auto w-full
                        px-[2rem] py-[2.5rem] md:px-[3rem] md:py-[3rem] lg:px-[4rem] lg:py-[4rem]
                        xl:px-[5rem] xl:py-[5rem] flex"
                >
                    <button
                        className="absolute top-2.5 right-2.5 pl-[0.0rem] w-9 h-9 rounded-full border-2 border-brand bg-white text-brand
                                    font-bold text-[2.4rem]/[3.3rem] hover:bg-brand hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    {children}
                </div>
                {onPrevious && (
                    <button
                        type="button"
                        aria-label="Previous"
                        className={`${arrowClassName} left-[-3rem] md:left-[-4rem] translate-x-1/2 pr-[0.3rem]`}
                        onClick={onPrevious}
                    >
                        <ChevronLeft
                            size={26}
                            strokeWidth={3}
                        />
                    </button>
                )}
                {onNext && (
                    <button
                        type="button"
                        aria-label="Next"
                        className={`${arrowClassName} md:right-[1rem] right-[2rem] translate-x-1/2 pl-[0.3rem]`}
                        onClick={onNext}
                    >
                        <ChevronRight
                            size={26}
                            strokeWidth={3}
                        />
                    </button>
                )}
            </div>
        </>,
        document.getElementById("portal") as Element,
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(DunneWebModal)
