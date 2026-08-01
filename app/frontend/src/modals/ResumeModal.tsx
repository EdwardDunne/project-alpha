import React from "react"
import ReactDom from "react-dom"

interface Props {
    open: boolean
    children?: React.ReactNode
    onClose: () => void
}

export default function ResumeModal({ open, children, onClose }: Props) {
    if (!open) return null
    const modal_title = "Resume"

    return ReactDom.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/[0.43] z-[1000]"
                onClick={onClose}
            />
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[1001]
                            rounded-[0.6rem] max-h-[90dvh] overflow-y-auto w-[92vw] px-[2rem] py-[2.5rem]
                            md:w-[80vw] md:max-w-[106rem] md:h-[80vh] md:p-[2rem] flex flex-col flex-nowrap
                            justify-between items-center"
            >
                <h1 className="text-center w-full text-[2.4rem] font-semibold">
                    {modal_title}
                </h1>
                <span className="w-full h-[60vh] md:mb-[0rem] mb-[2.5rem]">
                    <iframe
                        src="https://drive.google.com/file/d/1pA9HMsiar6KLBY7l8xwGwx5LuUM3vttn/preview"
                        title="Resume Preview"
                        className="w-full h-full rounded"
                    />
                </span>
                <span className="flex justify-end items-center w-full">
                    <button
                        className="px-5 py-2 mr-4 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={() => {
                            window.open(
                                "https://drive.google.com/u/1/uc?id=1pA9HMsiar6KLBY7l8xwGwx5LuUM3vttn&export=download",
                                "_blank",
                            )
                        }}
                    >
                        Download
                    </button>
                    <button
                        className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </span>
            </div>
        </>,
        document.getElementById("portal") as Element,
    )
}
