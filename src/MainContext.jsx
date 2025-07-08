import React, { createContext, useState } from 'react'
import App from './App';

const Context = createContext();

export default function MainContext() {
    const [query, setQuery] = useState('')
    return (
        <>
            <Context.Provider value={{ query, setQuery }}>
                <App />
            </Context.Provider>


        </>
    )
}
export { Context };