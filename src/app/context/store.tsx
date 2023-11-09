"use client";

import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

interface ContextProps {
    tableType: string,
    setTableType: Dispatch<SetStateAction<string>>,

}

const GlobalContext = createContext<ContextProps>({
    tableType: '',
    setTableType: (): string => '',
})

export const GlobalContextProvider = ({ children }: { children : any }) => {
    const [tableType, setTableType] = useState('listTree');

    return ( 
        <GlobalContext.Provider value={{ tableType, setTableType,}}>
            {children}
        </GlobalContext.Provider>
    )

}

export const useGlobalContext = () => useContext(GlobalContext)