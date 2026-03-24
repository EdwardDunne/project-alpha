import React, { useState } from 'react'
import { connect } from 'react-redux';
import PublishersSelector from '../../components/PublishersSelector';
import { addCharacter } from '../../actions/comics';
import { Publisher } from '../../types';

interface Props {
    setDwModalOpen: (open: boolean) => void;
}

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

const AddCharacter: React.FC<Props> = ({ setDwModalOpen }) => {

    const [formData, setFormData] = useState({ name: '', publisher: '' });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const setPublisher = (publisher: Publisher | null) => {
        if (publisher) setFormData({ ...formData, publisher: publisher['key'] })
    }

    return (
        <div className='flex flex-col w-full'>
            <h2 className='text-2xl font-semibold text-center py-4 border-b border-gray-100'>Add Character</h2>
            <div className='flex-1 py-4 space-y-3'>
                <div>
                    <label className={labelClass} htmlFor='name'>Name</label>
                    <input className={inputClass} type='text' name='name' placeholder='Name' onChange={onChange} />
                </div>
                <PublishersSelector setPublisher={setPublisher}/>
            </div>
            <div className='flex justify-end pt-4 border-t border-gray-100'>
                <button
                    className='px-5 py-2 bg-brand text-white rounded hover:bg-brand-dark transition-colors font-semibold'
                    onClick={() => addCharacter(formData, setDwModalOpen)}
                >
                    Add Character
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = () => ({})
export default connect(mapStateToProps, {})(AddCharacter)
