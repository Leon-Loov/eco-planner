"use client";

import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";
/* Fix enums  */
interface ContextProps {
    tableType: string,
    setTableType: Dispatch<SetStateAction<string>>,
    graphType: string,
    setGraphType: Dispatch<SetStateAction<string>>
}

const GlobalContext = createContext<ContextProps>({
    tableType: '',
    setTableType: (): string => '',
    graphType: '',
    setGraphType: (): string  => '',
})

export const GlobalContextProvider = ({ children }: { children : any }) => {
    const [tableType, setTableType] = useState('listTree');
    const [graphType, setGraphType] = useState('mainGraph')

    return ( 
        <GlobalContext.Provider value={{ tableType, setTableType, graphType, setGraphType}}>
            {children}
        </GlobalContext.Provider>
    )

}

export const useGlobalContext = () => useContext(GlobalContext)