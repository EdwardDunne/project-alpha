import React from "react"
import ReactDom from "react-dom"

interface Props {
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmDialog: React.FC<Props> = ({
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) => {
    return ReactDom.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/[0.43] z-[1100]"
                onClick={onCancel}
            />
            <div
                className="fixed bg-white z-[1101] rounded-[0.6rem] w-[90vw] max-w-[40rem] px-[2rem] py-[2.5rem]"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <p className="text-[1.6rem] text-center mb-6">{message}</p>
                <div className="flex justify-center gap-3">
                    <button
                        className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-semibold text-[1.4rem]"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold text-[1.4rem]"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </>,
        document.getElementById("portal") as Element,
    )
}

export default ConfirmDialog
