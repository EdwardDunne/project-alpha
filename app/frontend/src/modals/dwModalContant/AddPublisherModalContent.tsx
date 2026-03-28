import React, { useState } from "react"
import { connect } from "react-redux"
import { addPublisher, getAllPublishers } from "../../actions/comics"

interface Props {
    setDwModalOpen: (open: boolean) => void
    getAllPublishers: () => void
}

const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
const labelClass = "block text-[1.4rem] font-medium text-gray-700 mb-1"

const AddPublisherModalContent: React.FC<Props> = ({
    setDwModalOpen,
    getAllPublishers,
}) => {
    const [formData, setFormData] = useState({ key: "", name: "" })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-[2.4rem] font-semibold text-center py-4 border-b border-gray-100">
                Add Publisher
            </h2>
            <div className="flex-1 py-4 space-y-3">
                <div>
                    <label
                        className={labelClass}
                        htmlFor="key"
                    >
                        Key
                    </label>
                    <input
                        className={inputClass}
                        type="text"
                        name="key"
                        placeholder="Key"
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label
                        className={labelClass}
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        className={inputClass}
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    className="px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold"
                    onClick={() => addPublisher(formData, setDwModalOpen)}
                >
                    Add Publisher
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, { getAllPublishers })(
    AddPublisherModalContent,
)
