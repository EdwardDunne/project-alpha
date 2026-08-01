import React from "react"
import ReactDom from "react-dom"
import { connect } from "react-redux"

interface Props {
    onClose: () => void
    children: React.ReactNode
}

const DunneWebModal: React.FC<Props> = ({ onClose, children }) => {
    return ReactDom.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/[0.43] z-[1000]"
                onClick={onClose}
            />
            <div
                className="fixed bg-white z-[1001] rounded-[0.6rem] max-h-[90dvh]
                        overflow-y-auto w-[92vw] px-[2rem] py-[2.5rem] md:w-[85vw]
                        md:px-[3rem] md:py-[3rem] lg:w-[65vw] lg:px-[4rem] lg:py-[4rem]
                        xl:w-[50vw] xl:px-[5rem] xl:py-[5rem] flex max-w-[87.8rem]"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <button
                    className="absolute top-2.5 right-2.5 pl-[0.1rem] w-9 h-9 rounded-full border-2 border-brand bg-white text-brand 
                                font-bold text-[2.4rem]/[3.3rem] hover:bg-brand hover:text-white transition-colors"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </>,
        document.getElementById("portal") as Element,
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(DunneWebModal)
