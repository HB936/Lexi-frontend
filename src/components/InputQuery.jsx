import React, { useContext, useState } from 'react';
import { FaCircleArrowUp } from "react-icons/fa6";
import { Context } from '../MainContext';

export default function InputQuery() {
    const [text, setText] = useState('');
    const { query, setQuery } = useContext(Context);

    const submitHandler = () => {
        if (text.trim() === '') return;
        setQuery(text.trim());
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitHandler();
        }
    };

    return (
        <div className="p-4 bg-[#303030] text-white w-[1250px] mx-auto rounded-2xl mb-7 relative">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown} // ⬅️ Added for Enter key
                className='placeholder-gray-200 w-full p-2 pe-10 border-none outline-none'
                type="text"
                placeholder='Ask Anything'
            />
            <button
                onClick={submitHandler}
                disabled={text.trim() === ""}
                className={`absolute text-[35px] ${text === '' ? 'text-gray-400' : 'cursor-pointer'} top-1/2 right-4 -translate-y-1/2`}
            >
                <FaCircleArrowUp />
            </button>
        </div>
    );
}
